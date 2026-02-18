// ==========================================
// CONFIGURAÇÃO DO ESTABELECIMENTO
// ==========================================
const MINHA_LOJA = {
    nome: "SnackExpress Delivery",
    whatsapp: "5511999999999", // <-- COLOQUE SEU NUMERO AQUI
    moeda: "R$"
};

// ==========================================
// BANCO DE DADOS DE PRODUTOS (COM IMAGENS)
// ==========================================
const PRODUTOS = [
    { 
        id: 1, 
        categoria: "burgers", 
        nome: "X-Burger Bacon", 
        preco: 28.90, 
        desc: "Carne 160g, muito bacon, queijo prato e maionese.",
        imagem: "https://via.placeholder.com/300x200?text=Burger+Bacon" // COLOQUE O LINK DA IMAGEM AQUI
    },
    { 
        id: 2, 
        categoria: "burgers", 
        nome: "Classic Salad", 
        preco: 24.00, 
        desc: "Pão brioche, carne 160g, alface, tomate e cebola roxa.",
        imagem: "https://via.placeholder.com/300x200?text=Classic+Salad"
    },
    { 
        id: 3, 
        categoria: "burgers", 
        nome: "Monster Catupiry", 
        preco: 35.00, 
        desc: "Duas carnes, catupiry original e cebola caramelizada.",
        imagem: "https://via.placeholder.com/300x200?text=Monster+Catupiry"
    },
    { 
        id: 4, 
        categoria: "bebidas", 
        nome: "Coca-Cola Lata", 
        preco: 6.00, 
        desc: "350ml bem gelada.",
        imagem: "https://via.placeholder.com/300x200?text=Coca+Cola"
    }
];

let carrinho = [];

// Iniciar sistema
window.onload = () => {
    carregarProdutos(PRODUTOS);
};

// ==========================================
// FUNÇÕES DE INTERFACE
// ==========================================

// Alerta visual rápido (Toast)
function showToast(nome) {
    const container = document.getElementById('toast-container');
    if(!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${nome} adicionado!`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Renderizar produtos com suporte a imagem
function carregarProdutos(lista) {
    const container = document.getElementById('menu-container');
    if(!container) return;

    container.innerHTML = lista.map(p => `
        <div class="product-card">
            <img src="${p.imagem}" alt="${p.nome}" class="product-image">
            <div class="product-info">
                <h3>${p.nome}</h3>
                <p>${p.desc}</p>
                <div class="product-price">${MINHA_LOJA.moeda} ${p.preco.toFixed(2)}</div>
                <button class="btn-add" onclick="adicionarAoCarrinho(${p.id})">Adicionar +</button>
            </div>
        </div>
    `).join('');
}

function filterCategory(cat) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.target.classList.add('active');

    if (cat === 'todos') {
        carregarProdutos(PRODUTOS);
    } else {
        const filtrados = PRODUTOS.filter(p => p.categoria === cat);
        carregarProdutos(filtrados);
    }
}

// ==========================================
// LÓGICA DO CARRINHO
// ==========================================

function adicionarAoCarrinho(id) {
    const produto = PRODUTOS.find(p => p.id === id);
    carrinho.push({...produto});

    showToast(produto.nome); // Alerta de sucesso
    atualizarInterfaceCarrinho();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
    document.getElementById('cart-count').innerText = carrinho.length;
    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    const totalFormatado = `${MINHA_LOJA.moeda} ${total.toFixed(2)}`;

    document.getElementById('cart-total-value').innerText = totalFormatado;
    document.getElementById('modal-total').innerText = totalFormatado;

    const itensContainer = document.getElementById('cart-items');
    itensContainer.innerHTML = carrinho.map((item, index) => `
        <div class="cart-item">
            <span>${item.nome}</span>
            <span>${MINHA_LOJA.moeda} ${item.preco.toFixed(2)} 
                <i class="fas fa-trash-alt" onclick="removerDoCarrinho(${index})" style="color:#ff4757; margin-left:10px; cursor:pointer"></i>
            </span>
        </div>
    `).join('');
}

// ==========================================
// MODAL E FORMULÁRIO
// ==========================================

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

function handlePaymentChange() {
    const pag = document.getElementById('pagamento').value;
    document.getElementById('troco').style.display = (pag === 'Dinheiro') ? 'block' : 'none';
}

function handleDeliveryChange() {
    const metodo = document.getElementById('metodo-entrega').value;
    const campoEndereco = document.getElementById('endereco');
    if(campoEndereco) {
        campoEndereco.style.display = (metodo === 'retirada') ? 'none' : 'block';
    }
}

// ==========================================
// ENVIO DO PEDIDO (VERSÃO FINAL)
// ==========================================
function sendOrder() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone_cliente').value;
    const endereco = document.getElementById('endereco').value;
    const entrega = document.getElementById('metodo-entrega').value;
    const pag = document.getElementById('pagamento').value;
    const troco = document.getElementById('troco').value;
    const obs = document.getElementById('obs').value;

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    if (!nome || !telefone) {
        alert("Por favor, preencha seu Nome e Telefone de quem vai receber.");
        return;
    }
    if (entrega === 'entrega' && !endereco) {
        alert("Por favor, informe o endereço para entrega.");
        return;
    }

    // Montagem da mensagem única
    let texto = `*🍔 NOVO PEDIDO - ${MINHA_LOJA.nome.toUpperCase()}*\n`;
    texto += `------------------------------------\n`;
    texto += `👤 *Cliente:* ${nome}\n`;
    texto += `📞 *Contato:* ${telefone}\n`;
    texto += `🛵 *Tipo:* ${entrega === 'entrega' ? 'Entrega em Casa' : 'Retirada no Local'}\n`;

    if(entrega === 'entrega') {
        texto += `🏠 *Endereço:* ${endereco}\n`;
    }

    texto += `\n*ÍTENS DO PEDIDO:*\n`;
    carrinho.forEach((item, i) => {
        texto += `${i+1}. ${item.nome} (${MINHA_LOJA.moeda} ${item.preco.toFixed(2)})\n`;
    });

    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    texto += `\n💰 *TOTAL: ${MINHA_LOJA.moeda} ${total.toFixed(2)}*`;
    texto += `\n💳 *Pagamento:* ${pag}`;

    if(pag === 'Dinheiro' && troco) {
        texto += `\n💵 *Troco para:* ${MINHA_LOJA.moeda} ${troco}`;
    }

    if(obs) {
        texto += `\n\n📝 *Observações:* ${obs}`;
    }

    texto += `\n------------------------------------`;

    // Alerta de sucesso para o cliente
    alert("✅ PEDIDO CONCLUÍDO COM SUCESSO!\n\nAgora você será redirecionado para o nosso WhatsApp para que possamos iniciar o preparo!");

    // Redirecionamento Final
    const msgFinal = encodeURIComponent(texto);
    const linkZap = `https://wa.me/${MINHA_LOJA.whatsapp}?text=${msgFinal}`;

    window.open(linkZap, '_blank');
    toggleCart(); 
}
