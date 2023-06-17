import fs from "fs";
import { v1 as uuidv1 } from "uuid";

export const imageFilter = function (fileName: string) {
    if (!fileName.match(/\.(jpg|jpeg|png|gif)$/)) {
        return false;
    }
    return true;
};

export async function fileUpload (file: any, options: FileUploaderOption): Promise<FileDetails> {
    if (!file) throw new Error('no file');

    if (options.fileFilter && !options.fileFilter(file.hapi.filename)) {
        throw new Error('type not allowed');
    }

    const orignalname = file.hapi.filename;
    const filename = uuidv1()+'-'+orignalname;
    const path = `${options.dest}${filename}`;
    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
        file.on('error', function (err: any) {
            reject(err);
        });

        file.pipe(fileStream);

        file.on('end', function (err: any) {
            const fileDetails: FileDetails = {
                fieldname: file.hapi.name,
                originalname: file.hapi.filename,
                filename,
                mimetype: file.hapi.headers['content-type'],
                destination: `${options.dest}`,
                path,
                size: fs.statSync(path).size,
            }

            resolve(fileDetails);
        })
    })
}
