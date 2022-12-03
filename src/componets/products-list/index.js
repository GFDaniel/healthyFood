import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import Product from '../product';

function ProductList() {
  
    const [products, setProducts] = useState([
        {   barcode: 3017620422003,
            img: "https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.430.400.jpg",
            name: "Nutella",
            quantity: 1
        },
        {
            barcode: 3274080005003, 
            img: "https://images.openfoodfacts.org/images/products/327/408/000/5003/front_en.797.400.jpg",
            name: "Eaux de sources",
            quantity: 1
        },
        {   barcode: 7622210449283, 
            img: "https://images.openfoodfacts.org/images/products/762/221/044/9283/front_en.427.400.jpg", 
            name: "Prince",
            quantity: 1
        }
    ]);

    const [scannedProduct, setScannedProduct] = React.useState('');
    const [scanScreen, setScanScreen] = React.useState(false);
    const [productsList, setProductsList] = React.useState([]);
    const [searchBoxText, setSearchBoxText] = React.useState();
    

    const scanProduct = async (barCode) => {
        let value = '';
        try {
          let response = await fetch(
            'https://world.openfoodfacts.org/api/v0/product/'+barCode,
          );
          value = await response.json();
          setScannedProduct({ barcode: value.code, name: value.product.product_name, img:value.product.image_url, quantity: 1})
          setScanScreen(!scanScreen)
        } catch (error) {
          console.error(error);
        }
    }

    const searchProduct = async () => {
        let value = '';
        try {
          let response = await fetch(
            'https://world.openfoodfacts.org/api/v0/product/'+searchBoxText,
          );
          value = await response.json();
        } catch (error) {
          console.error(error);
        }
    }

    const addProduct = () => {
        const objIndex = products.findIndex(obj => obj.barcode == scannedProduct.barcode);
        if (objIndex>=0) {
            let newProducts = [...products];
            newProducts[objIndex].quantity = products[objIndex].quantity+1;
            setProducts(newProducts);
            setScanScreen(!scanScreen)
        }else{
            setProducts(products => [...products, scannedProduct])
            setScanScreen(!scanScreen)
        }
    }

    const removeProduct = () => {
        const objIndex = products.findIndex(obj => obj.barcode == scannedProduct.barcode);
        if (objIndex>=0) {
            let newProducts = [...products];
            newProducts[objIndex].quantity = products[objIndex].quantity-1;
            setProducts(newProducts);
            setScanScreen(!scanScreen)
        }else{
            const newProducts = products.filter(obj => obj.barcode !== scannedProduct.barcode);
            setProducts(newProducts)
            setScanScreen(!scanScreen)
        }
    }

  
    return (
        <>
            { !scanScreen && (
                <>
                    <View style={{ height: 100, paddingHorizontal:40, paddingVertical:20, flexDirection: "row" }}>
                        <View style={{ flex: 3}}>
                            <TextInput
                                placeholder="Busca un producto"
                                style={{ height: 37, borderWidth: 1}}
                                onChangeText={setSearchBoxText}
                                value={searchBoxText}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft:12 }}>
                            <Button title="Buscar" style={{ height: 40 }}  onPress={() => searchProduct()}/>
                        </View>
                    </View>
                    <ScrollView>
                        {
                            products.map((product, i) => (
                                <TouchableOpacity>
                                    <Product key={i} product={product} />
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                    <View style={{ height: 100, paddingHorizontal:40, paddingVertical:20 }}>
                        <Button
                            title="Escanear" onPress={() => scanProduct('7622210449283')}
                        />
                    </View>
                </>
            )}

            { scanScreen && (
                <>
                    <View>
                        <TouchableOpacity>
                            <Product product={scannedProduct} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 50, paddingHorizontal:40, paddingTop:10 }}>
                        <Button
                            title="Agregar" onPress={() => addProduct() }
                        />
                    </View>
                    <View style={{ height: 100, paddingHorizontal:40, paddingVertical:10 }}>
                        <Button
                            title="Regresar" onPress={() => setScanScreen(!scanScreen)}
                        />
                    </View>
                </>
            )}
        </>

    );
}

export default ProductList;