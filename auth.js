// auth.js — login gate for Eiken Practice App (uses window.hk from supabase-client.js)
'use strict';

(function () {
  const $ = id => document.getElementById(id);

  function showLogin() {
    $("login-screen").classList.remove("hidden");
    $("page-layout").classList.add("hidden");
  }
  function showApp() {
    $("login-screen").classList.add("hidden");
    $("page-layout").classList.remove("hidden");
  }

  function showErr(msg) {
    const el = $("login-error");
    el.textContent = msg;
    el.classList.remove("hidden");
  }
  function clearErr() {
    const el = $("login-error");
    el.textContent = "";
    el.classList.add("hidden");
  }

  function waitForHk(cb) {
    if (window.hk) { cb(); return; }
    setTimeout(() => waitForHk(cb), 50);
  }

  waitForHk(function () {
    hk.onAuthChange(function (user) {
      if (user) showApp(); else showLogin();
    });
  });

  const loginForm = $("login-form");
  const signupForm = $("signup-form");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearErr();
    const email = $("login-email").value.trim();
    const password = $("login-password").value;
    const btn = $("login-submit");
    btn.disabled = true; btn.textContent = "ログイン中...";
    try {
      await hk.signIn(email, password);
    } catch (err) {
      showErr(err.message || "ログインに失敗しました。");
    } finally {
      btn.disabled = false; btn.textContent = "ログイン";
    }
  });

  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearErr();
    const name = $("signup-name").value.trim();
    const email = $("signup-email").value.trim();
    const password = $("signup-password").value;
    const btn = $("signup-submit");
    btn.disabled = true; btn.textContent = "登録中...";
    try {
      await hk.signUp(email, password, name);
      showErr("登録しました。確認メールが届いている場合はリンクをクリックしてからログインしてください。");
    } catch (err) {
      showErr(err.message || "登録に失敗しました。");
    } finally {
      btn.disabled = false; btn.textContent = "登録";
    }
  });

  $("show-signup").addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.classList.add("hidden");
    $("show-signup-wrap").classList.add("hidden");
    signupForm.classList.remove("hidden");
    $("show-login-wrap").classList.remove("hidden");
    clearErr();
  });

  $("show-login").addEventListener("click", function (e) {
    e.preventDefault();
    signupForm.classList.add("hidden");
    $("show-login-wrap").classList.add("hidden");
    loginForm.classList.remove("hidden");
    $("show-signup-wrap").classList.remove("hidden");
    clearErr();
  });

  $("logout-btn").addEventListener("click", async function () {
    await hk.signOut();
  });
})();
