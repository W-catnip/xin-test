// px转vw
export const px2vw = (px) => {
  if (/%/ig.test(px)) {
    return px;
  } else {
    return `${(px / 3.75).toFixed(2)}vw`
  }
}