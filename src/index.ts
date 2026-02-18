export type RevealOptions = {
  label?: string;
  revealDelayMs?: number;
  mailtoAfterReveal?: boolean;
  hardenUi?: boolean;
  blockContextMenu?: boolean;
};

const DEFAULTS: Required<RevealOptions> = {
  label: "Show contact",
  revealDelayMs: 250,
  mailtoAfterReveal: false,
  hardenUi: true,
  blockContextMenu: false,
};

export function rot13(input: string): string {
  let out = "";

  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);

    if (c >= 65 && c <= 90) {
      out += String.fromCharCode(((c - 65 + 13) % 26) + 65);
      continue;
    }

    if (c >= 97 && c <= 122) {
      out += String.fromCharCode(((c - 97 + 13) % 26) + 97);
      continue;
    }

    out += input[i];
  }

  return out;
}

export function mountRot13Reveal(
  container: HTMLElement,
  secretPlaintext: string,
  options: RevealOptions = {},
): { destroy: () => void } {
  const cfg = { ...DEFAULTS, ...options };
  const encoded = rot13(secretPlaintext);

  const previousStyle = {
    userSelect: container.style.userSelect,
    webkitUserSelect: container.style.webkitUserSelect,
    cursor: container.style.cursor,
  };

  container.textContent = "";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = cfg.label;
  button.dataset.rot13 = encoded;

  const output = document.createElement("span");
  output.style.marginLeft = "0.5rem";

  if (cfg.hardenUi) {
    container.style.userSelect = "none";
    container.style.webkitUserSelect = "none";
    container.style.cursor = "default";
  }

  let contextMenuHandler: ((event: MouseEvent) => void) | null = null;
  if (cfg.blockContextMenu) {
    contextMenuHandler = (event: MouseEvent) => event.preventDefault();
    container.addEventListener("contextmenu", contextMenuHandler);
  }

  let revealed = false;
  const onClick = async (): Promise<void> => {
    if (revealed) {
      return;
    }
    revealed = true;

    if (cfg.revealDelayMs > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, cfg.revealDelayMs));
    }

    const decoded = rot13(button.dataset.rot13 ?? "");
    delete button.dataset.rot13;

    output.textContent = "";
    if (cfg.mailtoAfterReveal) {
      const link = document.createElement("a");
      link.href = `mailto:${decoded}`;
      link.textContent = decoded;
      output.appendChild(link);
    } else {
      output.appendChild(document.createTextNode(decoded));
    }

    button.disabled = true;
    button.textContent = "Revealed";
  };

  button.addEventListener("click", onClick);
  container.append(button, output);

  return {
    destroy(): void {
      button.removeEventListener("click", onClick);

      if (contextMenuHandler) {
        container.removeEventListener("contextmenu", contextMenuHandler);
      }

      if (cfg.hardenUi) {
        container.style.userSelect = previousStyle.userSelect;
        container.style.webkitUserSelect = previousStyle.webkitUserSelect;
        container.style.cursor = previousStyle.cursor;
      }

      container.textContent = "";
    },
  };
}
