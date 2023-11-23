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
        const dupedcode = this.Products.some((element)=>element.code!=product.code)
        if(!dupedcode){
            try{
                product.id = this.idcounter++;
                this.Products.push(product)
                await this.SaveFile(this.Products)
                console.log("Product created");
            }catch(error){
                console.log("Error:"+error);
            }
        }
    }

    async editProduct(id, updatedProduct) {
        const productToEdit = this.getProductById(id);


        if (productToEdit) {
            const index = this.Products.findIndex(product => product.id == id);
            console.log(index)

            if (index !== -1) {
                let titleP = updatedProduct.title ?? productToEdit.title;
                let descriptionP = updatedProduct.desc ?? productToEdit.desc;
                let codeP = updatedProduct.code ?? productToEdit.code;
                let priceP = isNaN(updatedProduct.price) ? productToEdit.price : Number(updatedProduct.price);
                let stockP = updatedProduct && updatedProduct.stock != null ? updatedProduct.stock : productToEdit.stock;
                let thumbnailsP = updatedProduct.thumbnail ?? productToEdit.thumbnail;



                this.Products[index] = { 
                ...this.Products[index],
                title: titleP, 
                description: descriptionP, 
                code: codeP, 
                price: Number(priceP), 
                stock: Number(stockP), 
                thumbnail: thumbnailsP 
                }


                const response = await this.SaveFile(this.Products);
                if (response) {
                    console.log("Producto editado con éxito");
                } else {
                    console.log("Failure at editing");
                }
            } else {
                console.log("Index not found for the product");
                }
        } else {
            tconsole.log("Product not found");
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

    getProducts(){
        console.log(this.Products);
        return this.Products;
    }
}




class Product {
    constructor(code,title,description,price,status,thumbnail,stock){
        this.id=null;
        this.code=code;
        this.title=title;
        this.description=description;
        this.price=price;
        this.thumbnail=thumbnail;
        this.stock=stock;  
    }
}

async function ProductEnabler(){

    const productManager = new ProductManager("./Products.json")

    console.log("json inicial:");
    productManager.getProducts()

    const Producto1= new Product ("0001","ejemplo","es un ejemplo",5,"no hay thumbnail",15);
    const Producto2= new Product ("0002","ejemplo editable","es un ejemplo que se edita",5,"no hay thumbnail",15);
    const Producto3= new Product ("0003","ejemplo borrable","es un ejemplo que se borra",5,"no hay thumbnail",15);

    await productManager.addProduct(Producto1)
    await productManager.addProduct(Producto2)
    await productManager.addProduct(Producto3)

    console.log("json con productos agregados");
    productManager.getProducts()

    const idEditar = 2; 
    const productoEditado = {
    title: "Producto Editado",
    description: "Descripción Editada",
    price: 10,
    thumbnail: "thumbnail-editado",
    stock: 20,
    };
    await productManager.editProduct(idEditar, productoEditado);

    productManager.deleteProduct(3);

    console.log("json con productos editado/eliminado");
    await productManager.getProducts()
}

ProductEnabler()
