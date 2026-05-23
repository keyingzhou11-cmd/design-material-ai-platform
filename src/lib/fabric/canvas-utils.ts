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
  return canvas.toJSON(['data']);
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
    data: active.data,
  });

  canvas.remove(active);
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.renderAll();
}
