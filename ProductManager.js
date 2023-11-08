const fs = require("node:fs")


class ProductManager{
    constructor(filename){
        this.filename=filename
        if(fs.existsSync(filename)){
            try{
                let Products = fs.readFileSync(filename,"utf-8")
                this.Products = JSON.parse(Products)
            }catch (error){
                this.Products=[]
            }
        }else{
            this.Products=[]
        }
        this.idcounter = this.findMaxProductId() + 1;
    }

    findMaxProductId() {
        let maxId = 0;
    
        for (const product of this.Products) {
          if (product.id > maxId) {
            maxId = product.id;
          }
        }
    
        return maxId;
    }

    async SaveFile(data){
        try{
            await fs.promises.writeFile(
                this.filename,
                JSON.stringify(data,null,"\t")
            )
            return true
        }catch (error){
            console.log(error);
            return false
        }
    }

    

    async addProduct(product){
        product.id = this.idcounter++;
        this.Products.push(product)
        const response= await this.SaveFile(this.Products)

        if(response){
            console.log("producto creado");
        }else{
            console.log("Error creacion");
        }
    }

    async editProduct(id, updatedProduct) {
        const productToEdit = this.getProductById(id);
        if (productToEdit) {
            Object.assign(productToEdit, updatedProduct);
            //me recomendaron que use el object.assign para ahorrarme unas lineas, 
            //usualmente abria hecho unos 5 if-else, para hacerlo
            const response = await this.SaveFile(this.Products);

            if (response) {
                console.log("Producto editado con éxito");
            } else {
                console.log("Error en la edición del producto");
            }
        } else {
            console.log("Producto no encontrado para editar");
        }
    }
    
    deleteProduct(id){
        const productDelete = this.Products.findIndex((product) => product.id === id);
        if(productDelete)
        {
            this.Products.splice(productDelete,1)
            if (this.SaveFile(this.Products)) {
                console.log("Producto eliminado")
            } else{
                console.log("Eliminacion fallida");
            }
        }    
    }

    getProductById(id) {
        const product = this.Products.find((prod) => prod.id === id);
        if(product){
            console.log("Producto encontrado");
        }else{
            console.log("error en busqueda");
        }
        return product || null; 
    }

    ConsultarProductos(){
        console.log(this.Products);
        return this.Products;
    }
}




class Product {
    constructor(code,name,desc,price,thumbnail,stock){
        this.id=null;
        this.code=code;
        this.name=name;
        this.desc=desc;
        this.price=price;
        this.thumbnail=thumbnail;
        this.stock=stock;  
    }
}

async function ProductEnabler(){

    const productManager = new ProductManager("./Entrega2_Backend_Gramet/Products.json")

    console.log("json inicial:");
    productManager.ConsultarProductos()

    const Producto1= new Product ("0001","ejemplo","es un ejemplo",5,"no hay thumbnail",15);
    const Producto2= new Product ("0002","ejemplo editable","es un ejemplo que se edita",5,"no hay thumbnail",15);
    const Producto3= new Product ("0003","ejemplo borrable","es un ejemplo que se borra",5,"no hay thumbnail",15);

    await productManager.addProduct(Producto1)
    await productManager.addProduct(Producto2)
    await productManager.addProduct(Producto3)

    console.log("json con productos agregados");
    productManager.ConsultarProductos()

    const idEditar = 2; 
    const productoEditado = {
    name: "Producto Editado",
    desc: "Descripción Editada",
    price: 10,
    thumbnail: "thumbnail-editado",
    stock: 20,
    };
    await productManager.editProduct(idEditar, productoEditado);

    await productManager.deleteProduct(3);

    console.log("json con productos editado/eliminado");
    await productManager.ConsultarProductos()
}

ProductEnabler()
