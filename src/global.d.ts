interface ResponseWoo<T extends any> {
    status: number
    data: T
    headers: Map<string, string>
}

interface ProductImageWoo {
    id: number
    src: string
    name: string
}

interface ProductWoo {
    id: string
    name: string
    sku: string
    images: ProductImageWoo[]
    price: string
    description: string | null
}

interface Product {
    id: string
    name: string
    sku: string
    adjustment_transactions?: AdjustmentTransaction[]
    image: string
    price: number
    description?: string | null
    stock: number | null
}

interface AdjustmentTransaction {
    id: string
    sku: string
    product?: Product
    qty: number
    amount: number
}

interface PaginateRequest extends Request {
    query: {
        size?: number
        page?: number
    }
}

interface ProductBySkuRequest extends Request {
    params: {
        sku: string
    }
}

interface HapiFile {
    hapi: {
        filename: string
        headers: Map<String, String>
    }
    _data: Buffer
}

interface CreateProductRequest extends Request {
    payload: {
        sku: string
        name: string
        image: HapiFile
        price: number
        description?: string
    }
}
interface UpdateProductRequest extends Request {
    params: {
        sku: string
    }
    payload: {
        sku: string
        name: string
        image: HapiFile
        price: number
        description?: string
    }
}

interface FileUploaderOption {
    dest: string;
    fileFilter?(fileName: string): boolean;
}

interface FileDetails {
    fieldname: string;
    originalname: string;
    filename: string;
    mimetype: string;
    destination: string;
    path: string;
    size: number;
}

interface CreateAdjustmentTransactionRequest extends Request{
    payload: {
        sku: string
        qty: string
    }
}
interface UpdateAdjustmentTransactionRequest extends Request{
    params: {
        id: string
    }
    payload: {
        sku: string
        qty: string
    }
}

interface AdjustmentTransactionByIdRequest extends Request {
    params: {
        id: string
    }
}