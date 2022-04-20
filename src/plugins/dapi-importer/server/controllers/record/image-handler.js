const downloadResource = require("../../utils/download-resource");
const fs = require("fs");

async function getContent(record, uid) {
  return await strapi.query(uid).findOne({
    where: { uuid: record.content },
    populate: { images: { select: ["name"] } },
  });
}

async function downloadImage(record, uid, content, importer) {
  let exists = false;

  if (content.images?.length > 0) {
    exists = content.images.some((image) => record.image.includes(image.name));
  }

  if (exists) {
    importer.log("image exists", content.uuid, "error");
    return;
  }

  let resource;
  try {
    importer.log("downloading", record.image);
    resource = await downloadResource(record.image);
  } catch (e) {
    importer.log("download failed", `${record.image}(${e.message})`, "error");
    return;
  }

  importer.log("downloaded", record.image);
  if (!resource) {
    return;
  }

  try {
    await strapi
      .service(uid)
      .update(content.id, { files: { images: [resource] } });
    importer.persisted(content.uuid);
  } catch (e) {
    importer.log(
      "Error",
      `cannot update ${content.uuid}, message: ${e.message}`,
      "error"
    );
  }

  await fs.unlink(resource.path, () => importer.log("clean", resource.path));
}

async function imageHandler(record, uid, importer) {
  try {
    const content = await getContent(record, uid);

    if (!content) {
      return;
    }

    await downloadImage(record, uid, content, importer);
  } catch (e) {
    importer.log(
      "Error",
      `something went wrong ${record.content}, message: ${e.message}`,
      "error"
    );
  }
}

module.exports = imageHandler;
