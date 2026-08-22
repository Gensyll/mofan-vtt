/**
 * Shared resize helpers for Mofan application windows.
 */

/**
 * Clamp width and height to minima; allow growing past them.
 * @param {object} position
 * @param {number} minWidth
 * @param {number} minHeight
 * @returns {object}
 */
export function constrainSheetResize(position, minWidth, minHeight) {
  if (!position) return position;
  if (Number.isFinite(position.width) && position.width < minWidth) {
    position.width = minWidth;
  }
  if (Number.isFinite(position.height) && position.height < minHeight) {
    position.height = minHeight;
  }
  return position;
}

/**
 * Measure chrome (window header, sheet header, tabs, content padding).
 * @param {HTMLElement|null} element
 * @param {number} extra
 * @returns {number}
 */
export function measureSheetChrome(element, extra = 0) {
  if (!element) return extra;

  const windowHeader = element.querySelector('.window-header');
  const sheetHeader = element.querySelector('.sheet-header');
  const tabs = element.querySelector('.sheet-tabs');
  const content = element.querySelector('.window-content');

  let contentPad = 0;
  if (content) {
    const cs = getComputedStyle(content);
    contentPad =
      (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
  }

  return (
    (windowHeader?.offsetHeight ?? 30) +
    (sheetHeader?.offsetHeight ?? 0) +
    (tabs?.offsetHeight ?? 0) +
    contentPad +
    extra
  );
}
