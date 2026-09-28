// The address never appears in the HTML: it ships XOR-encoded in the bundle and is
// only decoded when someone clicks to reveal it, so scrapers (even ones that run JS)
// don't find it lying around.
const KEY = [23, 91, 142, 61];
const CODE = [122, 58, 250, 73, 116, 41, 235, 88, 121, 58, 224, 125, 112, 54, 239, 84, 123, 117, 237, 82, 122];

const decodeEmail = () => String.fromCharCode(...CODE.map((c, i) => c ^ KEY[i % KEY.length]));

// Turn the link into a real mailto link showing the address.
function revealEmail(a: HTMLAnchorElement) {
    const addr = decodeEmail();
    a.href = `mailto:${addr}`;
    a.textContent = addr;
    a.dataset.revealed = "";
}

// First click reveals the address; after that it behaves like a normal mailto link.
export function initEmailLinks() {
    document.querySelectorAll<HTMLAnchorElement>("a.email").forEach((a) => {
        a.addEventListener("click", (e) => {
            if ("revealed" in a.dataset) return;
            e.preventDefault();
            revealEmail(a);
        });
    });
}
