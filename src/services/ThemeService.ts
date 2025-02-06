import { setTheme, type Theme } from "@fluentui/web-components";
import { webDarkTheme, webLightTheme } from "@fluentui/tokens";
import { ref } from "vue";

export var currentTheme = ref<string>()
var htmlElement: HTMLElement;
const scheme = matchMedia("(prefers-color-scheme: dark)");

export function switchTheme(theme: string) {
  currentTheme.value = theme;
  localStorage.setItem("data-theme", theme);

  if (theme == "auto") {
    if (typeof scheme !== "undefined") {
      scheme.addEventListener("change", systemThemeListener);
      setGlobalTheme(scheme.matches ? "dark" : "light");
    }
  } else {
    if (typeof scheme !== "undefined") {
      scheme.removeEventListener("change", systemThemeListener);
    }

    setGlobalTheme(theme);
  }
}

export function initThemeService(element: HTMLElement) {
  htmlElement = element;
  if (!localStorage.getItem("data-theme")) {
    localStorage.setItem("data-theme", "auto");
  }

  currentTheme.value = localStorage.getItem("data-theme") as string;
  switchTheme(currentTheme.value as string);
}

function setGlobalTheme(theme: string) {
  setTheme(theme == "light" ? webLightTheme : webDarkTheme);
  htmlElement.setAttribute("data-theme", theme);
}

function systemThemeListener(e: MediaQueryListEvent) {
  setGlobalTheme(e.matches ? "dark" : "light");
}
