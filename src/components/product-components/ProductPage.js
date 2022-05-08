import React, {useState, useEffect} from 'react';
import {ProductFilter} from "./ProductFilter";
import {ProductCard} from "./ProductCard";

export const ProductPage = ({match}) => {

    const [filteredProduct, setFilteredProduct] = useState([]);
    const [categoryTree, setCategoryTree] = useState({});
    const [toFilterCategoryType, setToFilterCategoryType] = useState(0);

    let categoryTreeObj = {
        parentCategory: "",
        subCategory: "",
        childCategory: "",
        // id: "",
    }

    useEffect(() => {
        setCategoryThree();
    }, []);


    const categoryFilterItem = [
        {
            id: 1,
            title: "Cinsiyet",
            filterItems: [
                {
                    id: 1,
                    value: "Kadın"
                },
                {
                    id: 2,
                    value: "Erkek"
                },
                {
                    id: 3,
                    value: "Çocuk"
                },
            ]
        },

        {
            id: 2,
            title: "Marka",
            filterItems: [
                {
                    id: 1,
                    value: "Koton"
                },
                {
                    id: 2,
                    value: "Mango"
                },
                {
                    id: 3,
                    value: "LW"
                },
                {
                    id: 4,
                    value: "Zara"
                },
                {
                    id: 5,
                    value: "Zara"
                },
                {
                    id: 6,
                    value: "Zara"
                },
                {
                    id: 7,
                    value: "Zara"
                },
                {
                    id: 8,
                    value: "Zara"
                },
                {
                    id: 9,
                    value: "Zara"
                },
            ]
        },
    ]

    const products = [
        {
            id: 1,
            title: "Erkek Siyah T-Shirt",
            mark: "Zara",
            price: "2299.90 TL",
            rating: 2,
            img: "https://cdn.dsmcdn.com//ty5/product/media/images/20200627/11/3569549/75437598/0/0_org.jpg",
            category: [
                {
                    id: 2,
                    name: "Erkek",
                }
            ],
            subCategory: [
                {
                    id: 1,
                    name: "Giyim",
                }
            ],
            childCategory: [
                {
                    id: 1,
                    name: "T-shirt",
                }
            ]
        },
        {
            id: 2,
            title: "Beyaz Spor Ayakkabı",
            mark: "Nike",
            price: "1299.90 TL",
            rating: 4,
            img: "https://cdn.dsmcdn.com//ty278/product/media/images/20211222/10/14981168/166299753/1/1_org.jpg",
            category: [
                {
                    id: 1,
                    name: "Kadın",
                }
            ],
            subCategory: [
                {
                    id: 2,
                    name: "Ayakkabı",
                },
            ],
            childCategory: [
                {
                    id: 3,
                    name: "Yürüyüş",
                }
            ]
        },
        {
            id: 3,
            title: "Kadın Siyah T-Shirt",
            mark: "Zara",
            price: "599.90 TL",
            rating: 4,
            img: "https://cdn.dsmcdn.com//ty311/product/media/images/20220126/10/36369263/286929112/2/2_org.jpg",
            category: [
                {
                    id: 1,
                    name: "Kadın",
                }
            ],
            subCategory: [
                {
                    id: 1,
                    name: "Giyim",
                },
            ],
            childCategory: [
                {
                    id: 1,
                    name: "T-Shirt",
                },
            ]
        },
        {
            id: 4,
            title: "Çocuk Beyaz T-Shirt",
            mark: "Mavi",
            price: "99.90 TL",
            rating: 5,
            img: "https://cdn.dsmcdn.com//ty370/product/media/images/20220324/14/75485319/195940598/1/1_org.jpg",
            category: [
                {
                    id: 3,
                    name: "Çocuk",
                }
            ],
            subCategory: [
                {
                    id: 1,
                    name: "Giyim",
                },
            ],
            childCategory: [
                {
                    id: 1,
                    name: "T-Shirt",
                },
            ]
        },
    ]

    const getFilteredProduct = () => {
        console.log(toFilterCategoryType)
        return products.filter((x) => {
            if (toFilterCategoryType === 1) {
                return x.category[0].name.toLowerCase() === categoryTree.parentCategory;
            } else if (toFilterCategoryType === 2) {
                return (x.category[0].name.toLowerCase() === categoryTree.parentCategory) && findSubCategory(x);
            } else {
                return (x.category[0].name.toLowerCase() === categoryTree.parentCategory) && findSubCategory(x) && findChildCategory(x);
            }

        })
    }

    const findSubCategory = (product) =>{
        const list = product.subCategory.filter(x=>x.name.toLowerCase() === categoryTree.subCategory)
        return list.length > 0;
    }

    const findChildCategory = (product) =>{
        const list = product.childCategory.filter(x=>x.name.toLowerCase() === categoryTree.childCategory)
        return list.length > 0;
    }

    const productList = getFilteredProduct().map((x) => {
        return (
            <div key={x.id} className="product-card-items">
                <ProductCard product={x}/>
            </div>
        )
    })

    const setCategoryThree = () => {
        const categoryThreeList = match.params.id.split("-");

        if (categoryThreeList.length === 1) {
            categoryTreeObj.parentCategory = categoryThreeList[0].toLowerCase();
            setToFilterCategoryType(1) //parent category
        }
        if (categoryThreeList.length === 2) {
            categoryTreeObj.parentCategory = categoryThreeList[0].toLowerCase();
            categoryTreeObj.subCategory = categoryThreeList[1].toLowerCase();
            setToFilterCategoryType(2) // sub category
        }
        if (categoryThreeList.length === 3) {
            categoryTreeObj.parentCategory = categoryThreeList[0].toLowerCase();
            categoryTreeObj.subCategory = categoryThreeList[1].toLowerCase();
            categoryTreeObj.childCategory = categoryThreeList[2].toLowerCase();
            setToFilterCategoryType(3) // child category
        }

        setCategoryTree(categoryTreeObj)
    }

    console.log(categoryTree)

    return (
        <div className="catalog">
            <div className="product-catalog">

                <div className="product-filter">
                    <ProductFilter filterItemList={categoryFilterItem}/>
                </div>

                <div className="product-list">
                    {productList}
                </div>
            </div>
        </div>
    )
}
