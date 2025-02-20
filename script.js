const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

const expenseList= document.querySelector("ul")
const expenseTotal = document.querySelector("aside header h2")
const expenseQuantity = document.querySelector("aside header p span")

amount.oninput = () => {
//codigo para impedir o input de letras:
 let value = amount.value.replace(/\D/g, "")
//console.log(value)

//preciso passar o valor em centavos para esse codigo funcionar:
 value = Number(value) /100
 amount.value = formatCurrencyBRL(value)
}

//funcao para editar a formatacao
function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
  return value
}

//prevent default para a pagina nao recarregar quando eu preciosar o submit
form.onsubmit = (event) => {
    event.preventDefault()

//coleta dos dados inputados no formulario
const newExpense = {
  id: new Date().getTime(),
  expense: expense.value,
  amount: amount.value,
  category_id: category.value,
  category_name: category.options[category.selectedIndex].text,
  created_at: new Date()
}

expenseAdd(newExpense)
}

//criando uma funcao para adicionar a despesa na lista
function expenseAdd(newExpense) {
  try {
  //ver se a function ta funcionando com esse erro do teste:
  //throw new Error("erro de teste")

//cria um elemento para adicionar a lista
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

//cria o icone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

//cria o nome e o tipo
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    const expenseCateg = document.createElement("span")
    expenseCateg.textContent = newExpense.category_name

//cria o valorda despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")

    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount
      .toUpperCase()
      .replace("R$" , "")}`

//botao de remover a despesa
    const expenseRemove = document.createElement("img")
    expenseRemove.setAttribute("src", `img/remove.svg`)
    expenseRemove.setAttribute("alt" , `remover`)
    expenseRemove.classList.add("remove-icon")

//coloca o item na lista e coloca o icone no item
    expenseInfo.append(expenseName, expenseCateg)
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove)
    expenseList.append(expenseItem)

//chama a function que vai atualizar os totais
  formClear()
  updateTotals()

  } catch(error) {
    alert("Não foi possivel adicionar o item na lista")
    console.log(error)
  }
}

//atualizando os totais
function updateTotals(){
    try {
      const items = expenseList.children
      expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

      let total = 0
      for( item = 0; item<items.length; item++){
        const itemAmount = items[item].querySelector(".expense-amount")

        //remover caracteres nao numericos e substituir a virgula pelo ponto
        let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

        //converte o valor para float
        value = parseFloat(value)

        //confere se é um numero valido
        if(isNaN(value)){
          return alert("não foi possivel calcular o valor total. O valor nao parece ser um numero valido")
        }

        //incrementa o total
        total += Number(value)
      }

      const symbolBRL = document.createElement("small")
      symbolBRL.textContent = "R$"
      
      //formatando a visualizacao do valor
      total = formatCurrencyBRL(total).toUpperCase().replace("R$","")
      expenseTotal.innerHTML=""
      expenseTotal.append(symbolBRL, total)

    } catch(error) {
        console.log(error)
        alert("nao foi possivel atualizar os totais")
    }
}

//evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense")
    item.remove()
  }
  updateTotals()
})

//metodo para limpar os campos apos inserir o item na lista
function formClear(){
  expense.value = ""
  category.value = ""
  amount.value = ""
  expense.focus()
}