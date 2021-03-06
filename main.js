const links = [
  {
    name: "Twitter",
    url: "https://twitter.com",
    icon:
      "https://play-lh.googleusercontent.com/wIf3HtczQDjHzHuu7vezhqNs0zXAG85F7VmP7nhsTxO3OHegrVXlqIh_DWBYi86FTIGk=s180-rw",
  },
  {
    name: "CuriousCat",
    url: "https://curiouscat.me/inbox",
    icon:
      "https://play-lh.googleusercontent.com/6nVZ5tlgirX8XHk7h2dyfBVQ8hdm69_Kw9tW9tgeAUbhLW3c-8xLhd1XJdm7-o2YkBI=s180-rw",
  },
  {
    name: "Zoho Mail",
    url: "https://mail.zoho.com/",
    icon:
      "https://play-lh.googleusercontent.com/9AjFvEP6RP6zRd41Z9cuiyHe_qD47a1AN0QrvW9Ec0OfsmG9x-t09nmTQMAmmZuYrdso=s180-rw",
  },
  {
    name: "Proton Mail",
    url: "https://beta.protonmail.com/",
    icon:
      "https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/36/a7/2d/36a72d2c-39f7-fffc-93b9-f80e2bb4ffd3/AppUniversalIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp",
  },
  {
    name: "Plex",
    url: "http://127.0.0.1:32400/web/index.html",
    icon:
      "https://play-lh.googleusercontent.com/it6VzGgcn3llVrhxeb27DnfIPtqFiNUqG9ANQH5guy-_SIDL8MuWbwzGqgaOWTwHVw=s180-rw",
  },
  {
    name: "Photos",
    url: "https://photos.google.com",
    icon:
      "https://play-lh.googleusercontent.com/ZyWNGIfzUyoajtFcD7NhMksHEZh37f-MkHVGr5Yfefa-IX7yj9SMfI82Z7a2wpdKCA=s180-rw",
  },
  {
    name: "Dropbox",
    url: "https://dropbox.com/home",
    icon:
      "https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/df/26/d2/df26d227-6334-ec00-8b58-4c982c12db2e/AppIcon-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp",
  },
  {
    name: "Tweak Mail",
    url: "https://mail.google.com/mail/u/1/#inbox",
    icon:
      "https://play-lh.googleusercontent.com/KSuaRLiI_FlDP8cM4MzJ23ml3og5Hxb9AapaGTMZ2GgR103mvJ3AAnoOFz1yheeQBBI=s180-rw",
  },
  {
    name: "Tweak Drive",
    url: "https://drive.google.com/drive/u/1",
    icon:
      "https://play-lh.googleusercontent.com/t-juVwXA8lDAk8uQ2L6d6K83jpgQoqmK1icB_l9yvhIAQ2QT_1XbRwg5IpY08906qEw=s180-rw",
  },
  {
    name: "HR Locker",
    url: "https://login.hrlocker.com/Account/SignIn?ReturnUrl=%2FTimeOn",
    icon:
      "https://hrlocker.ams3.cdn.digitaloceanspaces.com/wp-content/uploads/2019/01/cropped-HRLocker_wp_site_logo_512clear-270x270.png",
  },
  // {
  //   name: "Slack",
  //   url: "https://app.slack.com/client/T041LLY3A",
  //   icon:
  //     "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png",
  // },
  {
    name: "Mercado Livre",
    url: "https://mercadolivre.com.br",
    icon:
      "https://play-lh.googleusercontent.com/Ed5JtmBBRXogvZgW0xO8Cj96wo54k7-1c8NPjoUC3FqcCd2jGgMPaWdKH64EjJxbuPI=s180-rw",
  },
  {
    name: "WhatsApp",
    url: "https://web.whatsapp.com/",
    icon: "icons/whatsapp.png",
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/",
    icon:
      "https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/15/0e/ce/150ecec1-c05e-b42f-771b-95ec75df3acc/AppIcon-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.png",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/",
    icon:
      "https://play-lh.googleusercontent.com/2sREY-8UpjmaLDCTztldQf6u2RGUtuyf6VT5iyX3z53JS4TdvfQlX-rNChXKgpBYMw=s180-rw",
  },
  {
    name: "Organizze",
    url: "https://app.organizze.com.br",
    icon:
      "https://play-lh.googleusercontent.com/prPgPlq7wRcd7OGw0MKylsmoe9mB5r23n8K1YGYh417__fBP9bI_PhhLhTwZsrO8SA=s180-rw",
  },
  {
    name: "qBittorrent",
    url: "http://localhost:9999/",
    icon: "icons/qbittorrent.png",
  },
  {
    name: "Home Assistant",
    url: "http://127.0.0.1:8123",
    icon:
      "https://play-lh.googleusercontent.com/iS3Wa525QXuFdSkWi-s45GUK4oiPpOgmWQosv81pk0P1dF8Al6opybbofk5v-5hTQhua=s180-rw",
  },
  {
    name: "IFTTT",
    url: "https://ifttt.com",
    icon:
      "https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/54/b8/36/54b836ca-2e71-54c6-e650-f699535cabb0/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/246x0w.webp",
  },
  {
    name: "Feedly",
    url: "https://feedly.com/",
    icon:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/d6/09/b0/d609b0a3-8cd5-71ba-ad7d-2f46ee041a68/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp",
  },
  {
    name: "RemessaOnline",
    url: "https://business.remessaonline.com.br/dashboard/recebimentos",
    icon:
      "https://play-lh.googleusercontent.com/vH9wiMrRw-gnadYptna4g1b7jVufoM6KYDyJLdPsZ3HFrtPl4RWXy4tEG3XeEqD1Mhsa=s180-rw",
  },
];

const time = document.querySelector("#time");
const ul = document.querySelector("ul");

function renderLinks() {
  links.forEach((link) => {
    const li = document.createElement("li");

    li.innerHTML = `
    <a href="${link.url}" target="_parent">
      <img src="${link.icon}" />
      <span>${link.name}</span>
    </a>
  `;

    ul.appendChild(li);
  });
}

function renderTime() {
  const now = new Date();
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);

  time.innerHTML = `${hours}:${minutes}`;
}

setInterval(renderTime, 1000);
renderTime();
renderLinks();

setTimeout(() => document.body.classList.add("loaded"), 100);
