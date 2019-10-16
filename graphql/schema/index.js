const { gql } = require("apollo-server-express");

const description = `
  id: Int!
  title: String!
  url: String!
  img_small: String!
  img_medium: String!
  price: Float!
  category: String!
`;

module.exports = gql`

type Query {
    home: [Goods!]!
    category(cat:String!): [Goods!]!
    categoryPagination(cat:String!, page:Int!): [Goods!]!,
    item(title:String!): [Item!]!
    showOrders: [Order!]   
}

type Mutation {
    deleteOrder(id:String!): String!
    updateOrder(id:String!): String!
}

type Goods {
    ${description}
}

type Item {
    ${description}
    img_original: String!
    description: String!
}

type Order {
    _id:String!
    name:String!
    address:String!
    email:String!
    items:[OrderItem!]!
    total:Float!
}

type OrderItem {
    id:Int!
    title:String!
    price:Float!
    qty:Int!
}
`;
