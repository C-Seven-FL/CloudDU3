async function Call(baseUri, useCase, dtoIn, method) {
  // return fetch
  let response;
  if (!method || method === "get") {
    response = await fetch(
      `${baseUri}/${useCase}${
        dtoIn && Object.keys(dtoIn).length
          ? `?${new URLSearchParams(dtoIn)}`
          : ""
      }`
    );
  } else {
    response = await fetch(`${baseUri}/${useCase}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

const baseUri = "http://localhost:8888";

const FetchHelper = {
  exercise: {
    add: async (dtoIn) => {
      return await Call(baseUri, "exercise/add", dtoIn, "post");
    },
    get: async (dtoIn) => {
      return await Call(baseUri, "exercise/get", dtoIn, "get");
    },
    load: async (dtoIn) => {
      return await Call(baseUri, "exercise/load", dtoIn, "post");
    },
    update: async (dtoIn) => {
      return await Call(baseUri, "exercise/update", dtoIn, "post");
    },
    delete: async (dtoIn) => {
      return await Call(baseUri, "exercise/delete", dtoIn, "post");
    },
  },

  wrecord: {
    create: async (dtoIn) => {
      return await Call(baseUri, "wrecord/create", dtoIn, "post");
    },
    get: async (dtoIn) => {
      return await Call(baseUri, "wrecord/get", dtoIn, "get");
    },
    load: async (dtoIn) => {
      return await Call(baseUri, "wrecord/load", dtoIn, "post");
    },
    update: async (dtoIn) => {
      return await Call(baseUri, "wrecord/update", dtoIn, "post");
    },
    delete: async (dtoIn) => {
      return await Call(baseUri, "wrecord/delete", dtoIn, "post");
    },
  },
};

export default FetchHelper;
