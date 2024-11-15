import { Button, Form, Table } from "react-bootstrap";
import "./App.css";
import { useState } from "react";
import { nanoid } from "nanoid";
import styled from "styled-components";
import IconButton from "./components/IconButton";
import Fuse from "fuse.js";

const shops = [
  {
    id: 1,
    name: "Migros",
  },
  {
    id: 2,
    name: "Teknosa",
  },
  {
    id: 3,
    name: "Bim",
  },
];

const categories = [
  {
    id: 1,
    name: "Elektronik",
  },
  {
    id: 2,
    name: "Şarküteri",
  },
  {
    id: 3,
    name: "Oyuncak",
  },
  {
    id: 4,
    name: "Bakliyat",
  },
  {
    id: 5,
    name: "Fırın",
  },
];

const TableRow = styled.tr`
  text-decoration: ${(props) =>
    props.isBought === true ? "line-through" : "unset"};
`;

function App() {
  const [products, setProducts] = useState([]);

  const [productName, setProductName] = useState("");
  const [productShop, setProductShop] = useState("");
  const [productCategory, setProductCategory] = useState("");

  const [filteredName, setFilteredName] = useState("");

  const [filteredShopId, setFilteredShopId] = useState("");
  const [filteredCategoryId, setFilteredCategoryId] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("");

  const handleAddProduct = () => {
    const product = {
      id: nanoid(),
      name: productName,
      category: productCategory,
      shop: productShop,
    };

    setProducts([...products, product]);
  };

  // Name
  const filteredProducts = products.filter((product) => {
    const fuse = new Fuse(products, {
      keys: ["name"],
    });
    const res = fuse.search(filteredName);

    if (filteredName !== "" && !res.find((r) => r.item.id === product.id)) {
      return false;
    }

    // Status
    if (
      (filteredStatus !== "reset" &&
        product.isBought === true &&
        filteredStatus !== true) ||
      (product.isBought === undefined && filteredStatus === true)
    ) {
      return false;
    }

    // Shop
    if (filteredShopId !== "" && product.shop !== filteredShopId) {
      return false;
    }

    // Category
    if (filteredCategoryId !== "" && product.category !== filteredCategoryId) {
      return false;
    }

    return true;
  });
  return (
    <>
      <div className="d-flex align-items-end">
        <Form className="d-flex align-items-end">
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Ürün İsmi</Form.Label>
            <Form.Control
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
              }}
              type="text"
              placeholder="Almak istediğiniz ürünü girin ve ekle butonuna tıklayın."
            />
          </Form.Group>
          <Form.Select
            style={{
              maxWidth: "120px",
            }}
            aria-label="Default select example"
            value={productShop}
            onChange={(e) => {
              setProductShop(e.target.value);
            }}
          >
            <option>Mağaza</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            style={{
              maxWidth: "120px",
            }}
            aria-label="Default select example"
            value={productCategory}
            onChange={(e) => {
              setProductCategory(e.target.value);
            }}
          >
            <option>Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form>
        <Button onClick={handleAddProduct}>Ekle</Button>
      </div>
      <p>
        Satın aldığınız ürünün üzerine tıklayarak üzerini çizebilir ve satın
        alınmış statüsüne taşıyabilirsiniz.
      </p>
      <Form className="d-flex align-items-end">
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Filtrele</Form.Label>
          <Form.Control
            value={filteredName}
            onChange={(e) => {
              setFilteredName(e.target.value);
            }}
            type="text"
            placeholder="Aradığınız ürünü yazın"
          />
        </Form.Group>
        <Form.Group
          onChange={(e) => {
            const val = e.target.value;

            setFilteredStatus(
              val === "reset" ? val : val === "true" ? true : false
            );
          }}
        >
          <Form.Check
            inline
            value={"reset"}
            label="Sıfırla"
            name="group1"
            type={"radio"}
            id={`inline-radio-1`}
          />
          <Form.Check
            inline
            value={true}
            label="Alınmış"
            name="group1"
            type={"radio"}
            id={`inline-radio-2`}
          />
          <Form.Check
            inline
            value={false}
            label="Alınmamış"
            name="group1"
            type={"radio"}
            id={`inline-radio-3`}
          />
        </Form.Group>
        <Form.Select
          style={{
            maxWidth: "120px",
          }}
          aria-label="Default select example"
          value={filteredShopId}
          onChange={(e) => {
            setFilteredShopId(e.target.value);
          }}
        >
          <option value={""}>Tüm Mağazalar</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          style={{
            maxWidth: "120px",
          }}
          aria-label="Default select example"
          value={filteredCategoryId}
          onChange={(e) => {
            setFilteredCategoryId(e.target.value);
          }}
        >
          <option value={""}>Tüm Kategoriler</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form>
      <Table>
        <thead>
          <tr>
            <th>Ürün İsmi</th>
            <th>Mağaza</th>
            <th>Kategori</th>
            <th>ID</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <TableRow
              isBought={product.isBought}
              onClick={() => {
                setProducts((oldProducts) => {
                  const updatedProducts = oldProducts.map((oldProduct) => {
                    if (oldProduct.id === product.id) {
                      return { ...oldProduct, isBought: true };
                    } else {
                      return oldProduct;
                    }
                  });
                  if (updatedProducts.every((uP) => Boolean(uP.isBought))) {
                    alert("Alışveriş Tamamlandı!");
                  }
                  return updatedProducts;
                });
              }}
              key={product.id}
            >
              <td>{product.name}</td>
              <td>
                {shops.find((shop) => shop.id === parseInt(product.shop))?.name}
              </td>
              <td>
                {
                  categories.find(
                    (category) => category.id === parseInt(product.category)
                  )?.name
                }
              </td>
              <td>{product.id}</td>
              <IconButton
                handleClick={() => {
                  setProducts(
                    products.filter(
                      (filterProduct) => filterProduct.id !== product.id
                    )
                  );
                }}
              />
            </TableRow>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default App;
