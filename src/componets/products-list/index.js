import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Button, TextInput, Text, StyleSheet } from 'react-native';
import { useCameraDevices } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

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

    const [item, setItem] = React.useState();
    const [removeItem, setRemoveItem] = React.useState(false);
    const [scannedProduct, setScannedProduct] = React.useState('');
    const [scanScreen, setScanScreen] = React.useState(false);
    const [searchBoxText, setSearchBoxText] = React.useState();
    const [searchedProduct, setSearchedProduct] = React.useState([]);
    const [foundProduct, setFoundProduct] = React.useState(false);
    const [notFoundProduct, setNotFoundProduct] = React.useState(false);

    const [scanQRCode, setScanQRCode] = React.useState(false);
    const [hasPermission, setHasPermission] = React.useState(false);
    const devices = useCameraDevices();
    const device = devices.back;

    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
        checkInverted: true,
    });
    
    React.useEffect(() => {
        (async () => {
          const status = await Camera.requestCameraPermission();
          setHasPermission(status === 'authorized');
        })();
    }, []);
    

    const scanProduct1 = async (barCode) => {
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

    const scanProduct = async () => {
        setScanQRCode(!scanQRCode)
    }

    const searchProduct = () => {
        if (searchBoxText) {
            const objIndex = products.findIndex(obj => obj.name.toUpperCase().indexOf(searchBoxText.toUpperCase()) !== -1 );
            if (objIndex>=0) {
                setSearchedProduct(products[objIndex])
                setFoundProduct(!foundProduct)
            }else{
                setNotFoundProduct(!notFoundProduct)
            }           
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
        const objIndex = products.findIndex(obj => obj.barcode == item.barcode);
        const quantity = products[objIndex].quantity;
        if (quantity>1) {
            let newProducts = [...products];
            newProducts[objIndex].quantity = products[objIndex].quantity-1;
            setProducts(newProducts);
        }else{
            const newProducts = products.filter(obj => obj.barcode !== item.barcode);
            setProducts(newProducts)
        }
        setRemoveItem(!removeItem)
    }

    const viewMore = (product) => {
        setItem(product)
        setRemoveItem(!removeItem)
    }


  
    return (
        <>
            { !scanQRCode && !removeItem && !foundProduct && !notFoundProduct && (
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
                                <TouchableOpacity onPress={()=>{viewMore(product)}}>
                                    <Product key={i} product={product}/>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                    <View style={{ height: 100, paddingHorizontal:40, paddingVertical:20 }}>
                        <Button
                            title="Escanear" onPress={() => scanProduct()}
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

            { removeItem && (
                <>
                    <View>
                        <TouchableOpacity>
                            <Product product={item} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 50, paddingHorizontal:40, paddingTop:10 }}>
                        <Button
                            title="Eliminar" onPress={() => removeProduct() }
                        />
                    </View>
                    <View style={{ height: 100, paddingHorizontal:40, paddingVertical:10 }}>
                        <Button
                            title="Regresar" onPress={() => setRemoveItem(!removeItem)}
                        />
                    </View>
                </>
            )}

            { foundProduct && (
                <>
                    <View>
                        <Text style={{ height: 50, paddingHorizontal:40, paddingVertical:10, fontWeight:'bold', fontSize:20 }}>Producto No Encontrado</Text>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <Product product={searchedProduct} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 100, paddingHorizontal:40, paddingVertical:10 }}>
                        <Button
                            title="Regresar" onPress={() => setFoundProduct(!foundProduct)}
                        />
                    </View>
                </>
            )}

            { notFoundProduct && (
                <>
                    <View>
                        <Text style={{ height: 50, paddingHorizontal:40, paddingVertical:10, fontWeight:'bold', fontSize:20 }}>Producto No Encontrado</Text>
                    </View>
                    <View style={{ height: 100, paddingHorizontal:40, paddingVertical:10 }}>
                        <Button
                            title="Regresar" onPress={() => setNotFoundProduct(!notFoundProduct)}
                        />
                    </View>
                </>
            )}

            { scanQRCode && device == null && hasPermission && (
                <ActivityIndicator size="large" color="#00ff00" />
            )}

            { scanQRCode && device != null && hasPermission && (
                <View>
                    <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    frameProcessor={frameProcessor}
                    frameProcessorFps={5}
                    />
                    {barcodes.map((barcode, idx) => (
                        <Text key={idx} style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
                            {barcode.displayValue}
                        </Text>
                    ))}
                </View>
            )}
        </>

    );
}

export default ProductList;