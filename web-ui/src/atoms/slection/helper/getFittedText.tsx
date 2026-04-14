export const getFittedText = (
  options: string[],
  containerWidth: number,
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  if (!options.length) return "";

  const temp = document.createElement("span");
  temp.style.visibility = "hidden";
  temp.style.whiteSpace = "nowrap";
  temp.style.position = "absolute";
  temp.style.font = window.getComputedStyle(containerRef.current).font;

  document.body.appendChild(temp);

  let result = "";

  for (let i = 0; i < options.length; i++) {
    const nextText = result ? `${result}, ${options[i]}` : options[i];

    temp.innerText = nextText;

    if (temp.offsetWidth > containerWidth) {
      result += "...";
      break;
    } else {
      result = nextText;
    }
  }

  document.body.removeChild(temp);
  return result;
};
