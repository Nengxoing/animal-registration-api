 
/* eslint-disable max-depth */
/* eslint-disable no-console */
import { Request } from "express";

const MIN_PATH_LENGTH = 10;

export const getPhotoPath = (file: Express.Multer.File | undefined): string | null => {
  try {
    let path: string | undefined = file?.path;
    if (!path || path.length <= MIN_PATH_LENGTH) {
      return null;
    }
    path = path.split("uploads").pop();
    return path ?? null;
  } catch {
    return null;
  }
};

export const getImagePath = ({ data, field, req }: { data: any, field: string, req: Request }) => {
  const hostpath = `${req.protocol}://${req.headers.host}`;
  const transformField = (item: any) => ({
    ...item,
    [field]: item[field] ? `${hostpath}${item[field]}` : null,
  });
  return Array.isArray(data) ? data.map(transformField) : transformField(data);
};

export async function getFileUrl(req: any): Promise<string | null> {
  if (!req.file?.filename) {
    return null;
  }
  const directory = req.file.destination.split("uploads/").pop() || "";
  return `/${directory}/${req.file.filename}`;
}

export function processFileUrl(req: any, fieldName: string): string | null {
  const hostpath = `${req.protocol}://${req.headers.host}`;
  try {
    // Case 1: Handle direct URL
    if (typeof req.body[fieldName] === "string") {
      let imagePath = req.body[fieldName];
      if (!imagePath) {
        return null;
      }
      imagePath = imagePath.replace(hostpath, "");
      return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    }

    // Case 2: Handle multer single file upload
    if (req.file?.filename) {
      const file = req.file;
      if (!file.destination || !file.filename) {
        throw new Error("Invalid file object");
      }
      const normalizedDest = file.destination.replace(/\\/g, "/"); // <<< แปลง \ เป็น /
      const directory = normalizedDest.split("uploads/").pop() || "";
      return `/${directory}/${file.filename}`.replace(/\/+/g, "/"); // Normalize multiple slashes
    }

    // Case 3: Handle multer multiple files upload
    if (req.files && Array.isArray(req.files[fieldName])) {
      const files = req.files as { [key: string]: Express.Multer.File[] };
      const file = files[fieldName][0];
      if (!file.destination || !file.filename) {
        throw new Error("Invalid file object in files array");
      }
      const normalizedDest = file.destination.replace(/\\/g, "/"); // <<< แปลง \ เป็น /
      const directory = normalizedDest.split("uploads/").pop() || "";
      return `/${directory}/${file.filename}`.replace(/\/+/g, "/"); // Normalize multiple slashes
    }

    // Return null if no file is found
    return null;
  } catch (error) {
    console.error("Error processing file URL:", error);
    return null;
  }
}

export async function getFileUrlByKey(req: any, key: string): Promise<string | null> {
  const hostpath = `${req.protocol}://${req.headers.host}`;
  if (typeof req.body[key] === "string") {
    let imagePath = req.body[key];
    imagePath = imagePath.replace(hostpath, "");
    return imagePath;
  }
  if (!req.file?.filename) {
    return null;
  }
  const directory = req.file.destination.split("uploads/").pop() || "";
  return `/${directory}/${req.file.filename}`;
}

export function getFileUrls(req: any) {
  const files = req.files;
  if (!files || files.length === 0) {
    return null;
  }
  const fileUrls = files.map((file: any) => {
    const directory = file.destination.split("uploads/").pop() || "";
    return `/${directory}/${file.filename}`;
  });
  return fileUrls;
}

type FileInfo = {
  name: string;
  file: string;
}[];

export function getFileUrlsWithName(req: any): FileInfo {
  const files = req.files as { destination: string; filename: string; originalname: string }[];
  if (!files || files.length === 0) {
    return [];
  }

  return files.map((file) => {
    const normalizedDest = file.destination.replace(/\\/g, "/");
    const directory = normalizedDest.split("uploads/").pop() || "";
    const filePath = `/${directory}/${file.filename}`.replace(/\/+/g, "/");

    return {
      file: filePath,
      name: decodeURIComponent(escape(file.originalname)),
    };
  });
}

export function getFileUrlsWithNameAndDelete(req: any): FileInfo {
  const files = req.files as { destination: string; filename: string; originalname: string }[];
  if (!files || files.length === 0) {
    return [];
  }
  return files.map((file) => {
    const directory = file.destination.split("uploads/").pop() || "";
    return {
      file: `/${directory}/${file.filename}`,
      name: file.originalname,
    };
  });
}

export const resolveImageUrls = ({
  records,
  fields,
  request,
  nestedKey,
  nestedImageField, // New prop for dynamic nested image path
}: {
  records: any;
  fields: string[];
  request: Request;
  nestedKey?: string;
  nestedImageField?: string; // e.g., "gallery.image"
}) => {
  const hostpath = `${request.protocol}://${request.headers.host}`;

  const transformItem = (item: any) => {
    if (!item) {
      return item;
    }
    const updatedItem = { ...item };

    // Transform direct fields
    fields.forEach((field) => {
      if (updatedItem[field]) {
        updatedItem[field] = `${hostpath}${updatedItem[field]}`;
      }
    });

    // Handle nested array dynamically if nestedKey and nestedImageField are provided
    if (nestedKey && nestedImageField && Array.isArray(updatedItem[nestedKey])) {
      const pathParts = nestedImageField.split("."); // Split the path, e.g., ["gallery", "image"]

      updatedItem[nestedKey] = updatedItem[nestedKey].map((nestedItem: any) => {
        const current = { ...nestedItem };
        let temp = current;

        // Traverse the nested structure to locate the image field
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (temp[part]) {
            temp[part] = { ...temp[part] }; // Clone to avoid mutating original
            temp = temp[part];
          } else {
            return current; // Path doesn’t exist, return unchanged
          }
        }

        // Update the final field (e.g., "image") with the full URL
        const lastPart = pathParts[pathParts.length - 1];
        if (temp[lastPart]) {
          temp[lastPart] = `${hostpath}${temp[lastPart]}`;
        }

        return current;
      });
    }

    return updatedItem;
  };

  return Array.isArray(records) ? records.map(transformItem) : transformItem(records);
};
export const resolvezFileUrls = ({
  records,
  fields,
  request,
  nestedKey,
  nestedImageField, // New prop for dynamic nested image path
}: {
  records: any;
  fields: string[];
  request: Request;
  nestedKey?: string;
  nestedImageField?: string; // e.g., "gallery.image"
}) => {
  const hostpath = `${request.protocol}s://${request.headers.host}`;

  const transformItem = (item: any) => {
    if (!item) {
      return item;
    }
    const updatedItem = { ...item };

    // Transform direct fields
    fields.forEach((field) => {
      if (updatedItem[field]) {
        updatedItem[field] = `${hostpath}${updatedItem[field]}`;
      }
    });

    // Handle nested array dynamically if nestedKey and nestedImageField are provided
    if (nestedKey && nestedImageField && Array.isArray(updatedItem[nestedKey])) {
      const pathParts = nestedImageField.split("."); // Split the path, e.g., ["gallery", "image"]

      updatedItem[nestedKey] = updatedItem[nestedKey].map((nestedItem: any) => {
        const current = { ...nestedItem };
        let temp = current;

        // Traverse the nested structure to locate the image field
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (temp[part]) {
            temp[part] = { ...temp[part] }; // Clone to avoid mutating original
            temp = temp[part];
          } else {
            return current; // Path doesn’t exist, return unchanged
          }
        }

        // Update the final field (e.g., "image") with the full URL
        const lastPart = pathParts[pathParts.length - 1];
        if (temp[lastPart]) {
          temp[lastPart] = `${hostpath}${temp[lastPart]}`;
        }

        return current;
      });
    }

    return updatedItem;
  };

  return Array.isArray(records) ? records.map(transformItem) : transformItem(records);
};