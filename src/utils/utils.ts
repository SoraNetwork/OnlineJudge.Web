export function changeFavicon(link: string) {
  let $favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if ($favicon !== null) {
    $favicon.href = link;
  } else {
    $favicon = document.createElement("link");
    $favicon.rel = "icon";
    $favicon.href = link;
    document.head.appendChild($favicon);
  }
}
