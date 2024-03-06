const sanitizeResults = (response) => {
  if (!response || !response.data || !Array.isArray(response.data)) {
    return [];
  }

  return response.data.map((item) => {
    let sanitized = sanitizeObject(item);
    return sanitized;
  });
};

function sanitizeObject(item) {
  let sanitized = {};
  if (!item || typeof item !== "object") {
    return sanitized;
  }
  if (Array.isArray(item)) {
    return item.map(sanitizeObject);
  }
  for (const [key, value] of Object.entries(item)) {
    if (key === "id") {
      sanitized[key] = value;
    } else if (key === "attributes") {
      for (const [keyAttribute, valueAttribute] of Object.entries(item[key])) {
        if (
          typeof item[key][keyAttribute] === "object" &&
          item[key][keyAttribute]
        ) {
          if ("data" in valueAttribute) {
            sanitized[keyAttribute] = sanitizeObject(valueAttribute.data);
          } else {
            sanitized[keyAttribute] = sanitizeObject(valueAttribute);
          }
        } else {
          sanitized[keyAttribute] = valueAttribute;
        }
      }
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export { sanitizeResults, sanitizeObject };
