import type { Canvas, FabricImage } from 'fabric';

export async function addImageToCanvas(
  canvas: Canvas,
  imageUrl: string,
  materialId?: string
): Promise<FabricImage> {
  const { FabricImage: FI } = await import('fabric');
  const img = await FI.fromURL(imageUrl, { crossOrigin: 'anonymous' });

  const maxW = canvas.width! * 0.4;
  const maxH = canvas.height! * 0.4;
  const scale = Math.min(maxW / (img.width || 1), maxH / (img.height || 1), 1);
  img.scale(scale);

  img.set({
    left: Math.random() * (canvas.width! - (img.width! * scale)) * 0.5 + 50,
    top: Math.random() * (canvas.height! - (img.height! * scale)) * 0.5 + 50,
    data: { materialId, type: 'material' },
  });

  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.renderAll();
  return img;
}

export function serializeCanvas(canvas: Canvas): object {
  return (canvas as Canvas & { toJSON: (propertiesToInclude?: string[]) => object }).toJSON([
    'data',
  ]);
}

export async function loadCanvasState(canvas: Canvas, state: object): Promise<void> {
  await canvas.loadFromJSON(state);
  canvas.renderAll();
}

export function deleteSelected(canvas: Canvas): void {
  const active = canvas.getActiveObjects();
  if (active.length) {
    active.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  }
}

export function rotateSelected(canvas: Canvas, degrees = 15): void {
  const active = canvas.getActiveObject();
  if (!active) return;

  active.rotate((active.angle || 0) + degrees);
  active.setCoords();
  canvas.renderAll();
  canvas.fire('object:modified', { target: active });
}

export async function duplicateSelected(canvas: Canvas): Promise<void> {
  const active = canvas.getActiveObject();
  if (!active) return;

  const cloned = await active.clone();
  cloned.set({
    left: (active.left || 0) + 24,
    top: (active.top || 0) + 24,
  });

  canvas.add(cloned);
  canvas.setActiveObject(cloned);
  canvas.renderAll();
}

export function zoomCanvas(canvas: Canvas, factor: number): void {
  const currentZoom = canvas.getZoom() || 1;
  const nextZoom = Math.min(Math.max(currentZoom * factor, 0.4), 2.5);
  canvas.setZoom(nextZoom);
  canvas.renderAll();
}

export async function replaceSelectedImage(canvas: Canvas, imageUrl: string): Promise<void> {
  const active = canvas.getActiveObject();
  if (!active || active.type !== 'image') return;

  const { FabricImage: FI } = await import('fabric');
  const img = await FI.fromURL(imageUrl, { crossOrigin: 'anonymous' });
  const scaleX = (active.width! * active.scaleX!) / (img.width || 1);
  const scaleY = (active.height! * active.scaleY!) / (img.height || 1);

  img.set({
    left: active.left,
    top: active.top,
    angle: active.angle,
    scaleX,
    scaleY,
    data: (active as typeof active & { data?: unknown }).data,
  });

  canvas.remove(active);
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.renderAll();
}
