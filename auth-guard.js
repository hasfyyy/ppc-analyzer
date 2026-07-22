// ============================================
// PPC Analyzer — "gardian" pentru paginile protejate
// Adaugă acest script (după supabase-config.js) în <head>-ul fiecărei pagini
// pe care vrei să o protejezi (index.html, Campaign_Map.html, Campaign_Builder.html).
// ============================================

(function () {
  // Ascunde tot conținutul până verificăm accesul, ca să nu "clipească" pagina
  document.documentElement.style.visibility = "hidden";

  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
  script.onload = runGuard;
  document.head.appendChild(script);

  async function runGuard() {
    var supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    var { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      goToLogin();
      return;
    }

    var { data: profile, error } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", session.user.id)
      .single();

    if (error || !profile || profile.status !== "approved") {
      goToLogin();
      return;
    }

    // Totul e ok — arătăm pagina
    document.documentElement.style.visibility = "visible";
  }

  function goToLogin() {
    var currentPage = encodeURIComponent(location.pathname + location.search);
    location.href = "login.html?redirect=" + currentPage;
  }
})();
