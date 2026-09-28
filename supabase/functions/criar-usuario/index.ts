import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // 1. Quem está chamando?
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const {
      data: { user },
    } = await admin.auth.getUser(token);
    if (!user) return json({ erro: "Não autenticado." }, 401);

    // 2. É admin?
    const { data: perfil } = await admin
      .from("profiles")
      .select("papel")
      .eq("id", user.id)
      .single();
    if (perfil?.papel !== "admin") return json({ erro: "Apenas admins." }, 403);

    // 3. Valida os dados
    const { email, senha, papel } = await req.json();
    if (!email || !senha || senha.length < 6)
      return json({ erro: "E-mail e senha (mín. 6) são obrigatórios." }, 400);
    if (!["aluno", "professor", "admin"].includes(papel))
      return json({ erro: "Papel inválido." }, 400);

    // 4. Cria o usuário
    const { data: novo, error } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });
    if (error) return json({ erro: error.message }, 400);

    // 5. Grava o papel
    const { error: errPerfil } = await admin
      .from("profiles")
      .upsert({ id: novo.user.id, papel });
    if (errPerfil) return json({ erro: errPerfil.message }, 400);

    return json({ ok: true, id: novo.user.id });
  } catch (e) {
    return json({ erro: (e as Error).message }, 500);
  }
});
