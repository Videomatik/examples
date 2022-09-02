
import baseCustomJSON from './data/customJSON.json'
import mercadoLivreStyle from './data/mercadoLivreStyle.json'

type CustomJSON = typeof baseCustomJSON

interface Product {
    name: string;
    image: string;
    description: string;
    price: string;
};

const deepCopy = (object: CustomJSON): CustomJSON => JSON.parse(JSON.stringify(object))

const truncateWithEllipsis = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...'
    }
    return text
}

const formatNumber = (number: number) => {
  // TODO: Improve the above code to work for values equal or greater then R$ 1.000,00
  return number.toFixed(2).replace(/\./g, ',');
}

const getInstallmentPrice = (price: string): string => {
  const parsedPrice: string = (
    price
    .replace(/R\$/g, '')
    .replace(/ /g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
  )
  const installmentPrice: number = parseFloat(parsedPrice) / 10

  return `ou 10x de R$ ${formatNumber(installmentPrice)}`
}

export default function getProductCustomJSON(product: Product): CustomJSON {
  const customJSON = deepCopy(baseCustomJSON)

  customJSON.images[0].source = mercadoLivreStyle.logoURL
  customJSON.images[1].source = product.image

  customJSON.texts[0].value = getInstallmentPrice(product.price)
  customJSON.texts[1].value = product.price
  customJSON.texts[2].value = truncateWithEllipsis(product.description, 175)
  customJSON.texts[3].value = truncateWithEllipsis(product.description, 45)

  customJSON.texts.forEach((text) => {
    if (text.fillColor === '#ffffff') {
      text.fillColor = mercadoLivreStyle.colors.darkBlue
    }
  });

  customJSON.shapes.forEach((shape) => {
    if (shape.color === '#aa1e0d') {
      shape.color = mercadoLivreStyle.colors.gold
    }
  });

  return customJSON;
}