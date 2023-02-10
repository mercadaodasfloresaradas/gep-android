
import * as Constants from  './Constants';
import { Storage } from  './LocalStorage';

const comunHeaders = {
   'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const getAPIURL = (route) =>{
    return (global.globalApp.getSelectedAPI() === 'external' ? Constants.APIRoute : Constants.APIRouteAlt) + route;
};

/**
 * Alert.alert(`${JSON.stringify(response._bodyText)}`);
 */
export const checkAppKey = (key) =>{
    return new Promise((resolve)=>{
        fetch(getAPIURL('/'),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inner: key,
            }),
        })
        .then((response)=>{
            //global.globalApp.debug('erro: ' + JSON.stringify({response}));
            switch (Constants.PlatformExport){
                case 'windows':
                    resolve(response._bodyText === 'true');
                    break;
                case 'android':
                    response.json().then(json => resolve(json));
                    break;
            }
        })
        .catch((error)=>{
            resolve({error, path: getAPIURL('') + '/'});
        });
    });

};

/**
    {
        "code":"",
        "id": "",
        "name": "",
        "price": 1 ,
        "description": "",
        "category": "",
        "img64": "",
    }

    {
        success: "",
        id: "",
        category: ""
    }
     */
export const createProduct = async (name, price, description, category, img64) =>{
    return new Promise(async(resolve)=>{
        const key = await Storage.getItem(Constants.AppKey);

        fetch(getAPIURL(Constants.CreateProduct),{
            method: 'POST',
            headers: comunHeaders,
            body: JSON.stringify({
                code: key,
                id: name.split(' ').join('_'),
                name,
                price: +((price.replace(',', '.')).split(',').join('')),
                category,
                description,
            }),
        })
        .then((response)=>{
            switch(Constants.PlatformExport){
                case 'windows':
                    const jResponse = JSON.parse(response._bodyText);
                    if (jResponse.success){
                        setPhoto(key, jResponse.id, jResponse.category, img64, resolve, jResponse.success);
                    } else {
                        resolve({error: jResponse});
                    }
                    break;
                case 'android':
                    response.json().then(json => {
                        if (json.success){
                            setPhoto(key, json.id, json.category, img64, resolve, json.success);
                        } else {
                            resolve({error: json});
                        }
                    });
                    break;
            }

        })
        .catch((error)=>{
            resolve({error, test: 'createProduct'});
            return error;
        });
    });

};



/**
    {
        "code":"",
        "id": "",
        "category": "",
        "img64": "",
    }
    {
        success: "",
    }
     */

    export const setPhoto = async (code, id, category, img64, resolve, success1) =>{
           const payload = JSON.stringify({
            code,
            id,
            category,
            img64: img64,
            });

           fetch(getAPIURL(Constants.SetPhoto),{
                method: 'POST',
                headers: comunHeaders,
                body: payload,
            })
            .then((response)=>{

                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);
                        if (jResponse.success){
                            resolve('Sucesso: ' + jResponse.success + ' / ' + success1);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json.success){
                                resolve('Sucesso: ' + json.success + ' / ' + success1);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error, test: `${img64.length} ${code} ${id} ${category} ${payload.length}`});
            });
    };


    /**
     {
         "category": "Cat1"
      }
      {
        products
      }
    */
    export const productsByCategory = (category) =>{
        return new Promise(async(resolve)=>{
                if (!category || category === ''){
                    resolve([]);
                    return;
                }
              fetch(getAPIURL(Constants.ProductsByCategory),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    category,
                }),
            })
            .then((response)=>{

                switch(Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);
                        if (jResponse && jResponse.products){
                            resolve(jResponse.products);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.products){
                                resolve(json.products);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }

            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };



    /**
      {
           "id": "product1"
           "category": "Cat1"
           "isOutOfSale": true
      }

      {
        "productPhoto": "img 64"
       }
     */
    export const photo = (id, category, isOutOfSale) =>{
        //Alert.alert(id + ' ' + category);
        return new Promise(async(resolve)=>{
              fetch(getAPIURL(Constants.Photo),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    category,
                    id,
                    isOutOfSale,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.productPhoto && jResponse.productPhoto.img64){
                            resolve(jResponse.productPhoto.img64);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.productPhoto && json.productPhoto.img64){
                                resolve(json.productPhoto.img64);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
     {
    }

    {
        categories: []
    }
    */
   export const categories = () =>{
       return new Promise(async(resolve)=>{
           fetch(getAPIURL(Constants.Categories),{
               method: 'GET',
               headers: comunHeaders,
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.categories){
                            resolve(jResponse.categories);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.categories){
                                resolve(json.categories);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }

            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };


    /**
    {
        "code":"",
        "id": "",
        "category": "",
        "isOnSale": true
    }

    {
        success: ""
    }
     */
    export const changeStateProduct = (id, category, isOnSale) =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);


            fetch(getAPIURL(Constants.ChangeStateProduct),{
                method: 'PATCH',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                    category,
                    id,
                    isOnSale,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.success){
                            resolve(jResponse.success);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.success){
                                resolve(json.success);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }

            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code":""
    }

    {
        products: files[]
    }
     */
    export const productsOutOfSale = () =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);


            fetch(getAPIURL(Constants.ProductsOutOfSale),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.products){
                            resolve(jResponse.products);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.products){
                                resolve(json.products);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }

            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };


    /**
    {
        "code":"",
        "id": "",
        "category": ""
    }

    {
        products: files[]
    }
     */
    export const removeProduct = (id, category) =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);


            fetch(getAPIURL(Constants.RemoveProduct),{
                method: 'DELETE',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                    id,
                    category,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.success){
                            resolve(jResponse.success);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.success){
                                resolve(json.success);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }

            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };


    /**
    {
        "code":"",
    }

    {
        sales : allSales[]
    }
     */
    export const newPurchases = () =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);

            fetch(getAPIURL(Constants.NewPurchases),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                }),
            })
            .then((response)=>{
                switch(Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.sales){
                            resolve(jResponse.sales);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.sales){
                                resolve(json.sales);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }

            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code":"",
    }

    {
        sales : allSales[]
    }
     */
    export const finilizedPurchases = () =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);


            fetch(getAPIURL(Constants.FinilizedPurchases),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                }),
            })
            .then((response)=>{
                switch(Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.sales){
                            resolve(jResponse.sales);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.sales){
                                resolve(json.sales);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code":"",
    }

    {
        sales : allSales[]
    }
     */
    export const oldPurchases = () =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);


            fetch(getAPIURL(Constants.OldPurchases),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.sales){
                            resolve(jResponse.sales);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.sales){
                                resolve(json.sales);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code":"",
        "id":"",
        "state":"", newPurchases\finilized\old
        "info": "" d - details\ c - conversations \ p - products
    }

    {
        info: file{}
    }
     */
    export const purchase = (id, state, info) =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);


            fetch(getAPIURL(Constants.Purchase),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                    id,
                    state,
                    info,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.info){
                            resolve(jResponse.info);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json =>{
                            if (json && json.info){
                                resolve(json.info);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code":"",
        "id":"", newPurchases\toPay\payed\finilized\old
        "state":""
    }

    {
        success: "",
        state: ""
    }
     */
    export const changeStatePurchase = (id, state) =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);


            fetch(getAPIURL(Constants.ChangeStatePurchase),{
                method: 'PATCH',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                    id,
                    state,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.success){
                            resolve(jResponse.state);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.success){
                                resolve(json.state);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code":"",
        "id":"",
        "state":"",
        "comment":""
    }

    {
        success: "Purchase conversation updated!",
        conversations: ['']
    }
     */
    export const comment = (id, state, newComment) =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);


            fetch(getAPIURL(Constants.Comment),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                    id,
                    state,
                    comment: newComment,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.success){
                            resolve(jResponse.conversations);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.success){
                                resolve(json.conversations);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code":"",
        "id": "",
        "name": "",
        "price": 1 ,
        "description": "",
        "category": "",
        "isOnSale": true
    }

    {
        success: "Edit with ID: " + result.id,
        id: "",
        category: ""
    }
     */
    export const editProduct = (id, name, price, description, category, isOnSale, img64, hasNewImage) =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);

            fetch(getAPIURL(Constants.EditProduct),{
                method: 'PATCH',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                    id,
                    name,
                    price: +((price.replace(',', '.')).split(',').join('')),
                    description,
                    category,
                    isOnSale,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.success){
                            if (hasNewImage){
                                editProductPhoto(key, id, category, img64, isOnSale, resolve, jResponse.success);
                            } else {
                                resolve('Sucesso: ' + jResponse.success);
                            }
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.success){
                                if (hasNewImage){
                                    editProductPhoto(key, id, category, img64, isOnSale, resolve, json.success);
                                } else {
                                    resolve('Sucesso: ' + json.success);
                                }
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code":"",
        "id": "",
        "category": "",
        "img64": "",
        "isOnSale": true,
    }
    {
        success: "",
    }
     */

    export const editProductPhoto = (code, id, category, img64, isOnSale, resolve, success1) =>{
        fetch(getAPIURL(Constants.EditProductPhoto),{
            method: 'PATCH',
            headers: comunHeaders,
            body: JSON.stringify({
                code,
                id,
                category,
                img64,
                isOnSale,
            }),
        })
        .then((response)=>{
            switch (Constants.PlatformExport){
                case 'windows':
                    const jResponse = JSON.parse(response._bodyText);
                    if (jResponse.success){
                        resolve('Sucesso: ' + jResponse.success + ' / ' + success1);
                    } else {
                        resolve({error: jResponse});
                    }
                    break;
                case 'android':
                    response.json().then(json => {
                        if (json.success){
                            resolve('Sucesso: ' + json.success + ' / ' + success1);
                        } else {
                            resolve({error: json});
                        }
                    });
                    break;
            }
        })
        .catch((error)=>{
            resolve({error});
        });
    };

    /**
    {
    }
    {
        config: {}
    }
     */
    export const configAll = () =>{
        return new Promise(async(resolve)=>{
            fetch(getAPIURL(Constants.ConfigAll),{
                method: 'GET',
                headers: comunHeaders,
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.config){
                            resolve(jResponse.config);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.config){
                                resolve(json.config);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code" : "test",
        "data" : {
            "contacts": "test",
            "payMethods": "test",
            "noService": "test",
            "welcome": "test",
            "storeName": "test",
            "warnings": "test",
            "delivery": "test",
            "support": "test",
            "returns": "test"
            "toPay": "test"
            "payed": "test"
            "finalized": "test"
            "limitProducts": 0,
            "limitDaily": 0,
            "facebook": "test",
            "instagram": "test",
        }
    }
    {
        info: "Saved correctly!"
    }
     */
    export const setConfig = (data) =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);
            fetch(getAPIURL(Constants.SetConfig),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                    data:{...data},
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.info){
                            resolve(jResponse.info);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.info){
                                resolve(json.info);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };

    /**
    {
        "code":"",
        "id":"",
        "state":""
    }
    {
        success: "Purchase deleted!"
    }
     */
    export const salesRemove = (id, state) =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);

            fetch(getAPIURL(Constants.SalesRemove),{
                method: 'DELETE',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                    id,
                    state,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.success){
                            resolve(jResponse.success);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.success){
                                resolve(json.success);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }
            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };


    /**
    {
        "code":"",
        "id": "",
        "name": "",
        "price": 1 ,
        "description": "",
        "category": "",
    }

    {
        success: "Test is up!"
    }
     */
export const testOnline = async (name, price, description, category, img64) =>{
    return new Promise(async(resolve)=>{
        const key = await Storage.getItem(Constants.AppKey);
        fetch(getAPIURL(Constants.TestOnline),{
            method: 'POST',
            headers: comunHeaders,
            body: JSON.stringify({
                code: key,
                id: name.split(' ').join('_'),
                name,
                price: +((price.replace(',', '.')).split(',').join('')),
                category,
                description,
            }),
        })
        .then((response)=>{
            switch (Constants.PlatformExport){
                case 'windows':
                    const jResponse = JSON.parse(response._bodyText);
                    if (jResponse.success){
                            testOnlinePhoto(key, img64, resolve, jResponse.success);
                    } else {
                        resolve({error: jResponse});
                    }
                    break;
                case 'android':
                    response.json().then(json =>{
                        if (json.success){
                            testOnlinePhoto(key, img64, resolve, json.success);
                       } else {
                           resolve({error: json});
                       }
                    });
                    break;
            }
        })
        .catch((error)=>{
            resolve({error});
        });
    });
};



/**
    {
        "code":"",
        "img64": "",
    }
    {
        success: "Test photo is up!"
    }
     */

    export const testOnlinePhoto = (code, img64, resolve, success1) =>{
            fetch(getAPIURL(Constants.TestOnlinePhoto),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    code,
                    img64,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);
                        if (jResponse.success){
                            resolve('Sucesso: ' + jResponse.success + ' / ' + success1);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json.success){
                                resolve('Sucesso: ' + json.success + ' / ' + success1);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }

            })
            .catch((error)=>{
                resolve({error});
            });
    };


    /**
    {
        "code":"",
        "id":"",
        "state":""
    }

    {
        success: "Notifications updated!",
    }
     */
    export const notifications = (id, state) =>{
        return new Promise(async(resolve)=>{
            const key = await Storage.getItem(Constants.AppKey);

            fetch(getAPIURL(Constants.Notifications),{
                method: 'POST',
                headers: comunHeaders,
                body: JSON.stringify({
                    code: key,
                    id,
                    state,
                }),
            })
            .then((response)=>{
                switch (Constants.PlatformExport){
                    case 'windows':
                        const jResponse = JSON.parse(response._bodyText);

                        if (jResponse && jResponse.success){
                            resolve(jResponse);
                        } else {
                            resolve({error: jResponse});
                        }
                        break;
                    case 'android':
                        response.json().then(json => {
                            if (json && json.success){
                                resolve(json);
                            } else {
                                resolve({error: json});
                            }
                        });
                        break;
                }

            })
            .catch((error)=>{
                resolve({error});
            });
        });
    };
