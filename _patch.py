# patch truncated style.css / app.js then link extras
from pathlib import Path
root = Path(__file__).resolve().parent

css_path = root / "style.css"
css = css_path.read_text(encoding="utf-8")
extra = (root / "basics-extra.css").read_text(encoding="utf-8")

RESPONSIVE_CLOSE = """  .flow-body { grid-template-columns: 1fr; }
  .flow-stage { height: 480px; }
  .viz3d-stage { height: 520px; }
  .demo-body { padding: 16px 16px; }
  .ch, .hero, .foot-in { padding: 0 20px; }
  .ch { padding-top: 40px; }
  .topbar { padding: 0 14px; }
  .brand-name { display: none; }
  .symtable td:first-child { width: 70px; }
  .symtable td:nth-child(2) { width: auto; }
  .journey { padding: 32px 16px 48px; }
  .journey-head { margin-bottom: 32px; }
  .journey-track { grid-template-columns: 1fr; gap: 28px; }
  .journey-track::before { display: none; }
  .journey-hub { text-align: left; padding: 0; }
  .journey-stop { align-items: flex-start; }
  .ch-air, .next { padding-left: 20px; padding-right: 20px; }
}
@media (max-width: 560px) {
  .hero h1 { font-size: 36px; }
  .pagelink { padding: 6px 10px; font-size: 12.5px; }
}

"""

if "BASICS PAGE" not in css and ".tree-item" not in css:
    cut = css.find("  .flow-body { grid-te")
    if cut == -1:
        cut = css.find("  .flow-body { grid")
    if cut != -1:
        css = css[:cut]
    if css.count("{") > css.count("}"):
        # still inside @media (max-width: 900px)
        css = css.rstrip() + "\n" + RESPONSIVE_CLOSE
    css = css.rstrip() + "\n\n/* ============================================================\n   BASICS PAGE\n   ============================================================ */\n" + extra
    css_path.write_text(css, encoding="utf-8")
    print("patched style.css", css_path.stat().st_size, "braces", css.count("{"), css.count("}"))
else:
    print("style.css already has extras", css_path.stat().st_size)

js_path = root / "app.js"
js = js_path.read_text(encoding="utf-8")
if "JOURNEY MAP" not in js:
    idx = js.rfind("})();")
    if idx != -1:
        js = js[: idx + 5] + "\n"
    js = js.rstrip() + "\n"
    js_path.write_text(js, encoding="utf-8")
    print("repaired app.js", js_path.stat().st_size, "endswith", repr(js[-20:]))
else:
    print("app.js already has journey")
