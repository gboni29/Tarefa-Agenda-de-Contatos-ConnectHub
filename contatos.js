"use strict";
const categoriasValidas = ["amigo", "trabalho", "familia", "outro"];
const validarCategoria = (categoria) => {
    return categoriasValidas.includes(categoria);
};
class AgendaContatos {
    constructor() {
        this.contatos = [];
        this.proximoId = 1;
        this.ouvintes = [];
    }
    inscrever(ouvinte) {
        this.ouvintes = [...this.ouvintes, ouvinte];
        return () => {
            this.ouvintes = this.ouvintes.filter(item => item !== ouvinte);
        };
    }
    notificar() {
        const copia = this.listar();
        this.ouvintes.forEach(ouvinte => ouvinte(copia));
    }
    criar(dados) {
        const novoContato = Object.assign(Object.assign({}, dados), { id: this.proximoId });
        this.proximoId += 1;
        this.contatos = [...this.contatos, novoContato];
        this.notificar();
        return Object.assign({}, novoContato);
    }
    buscarPorId(id) {
        const contato = this.contatos.find(item => item.id === id);
        return contato ? Object.assign({}, contato) : undefined;
    }
    listar() {
        return this.contatos.map(contato => (Object.assign({}, contato)));
    }
    atualizar(id, dados) {
        let contatoAtualizado;
        this.contatos = this.contatos.map(contato => {
            if (contato.id !== id) {
                return contato;
            }
            contatoAtualizado = Object.assign(Object.assign({}, contato), dados);
            return contatoAtualizado;
        });
        this.notificar();
        return contatoAtualizado ? Object.assign({}, contatoAtualizado) : undefined;
    }
    remover(id) {
        this.contatos = this.contatos.filter(contato => contato.id !== id);
        this.notificar();
    }
}
const extrairCampo = (lista, campo) => {
    return lista.map(item => item[campo]);
};
const agenda = new AgendaContatos();
const lista = document.querySelector("#lista");
const formulario = document.querySelector("#formulario");
const inputNome = document.querySelector("#nome");
const inputTelefone = document.querySelector("#telefone");
const inputEmail = document.querySelector("#email");
const inputCategoria = document.querySelector("#categoria");
const erro = document.querySelector("#erro");
const mostrarErro = (mensagem) => {
    if (erro) {
        erro.textContent = mensagem;
    }
};
const renderizarLista = (contatos) => {
    if (!lista)
        return;
    lista.innerHTML = "";
    contatos.forEach(contato => {
        const item = document.createElement("li");
        const info = document.createElement("div");
        info.className = "info";
        const nome = document.createElement("strong");
        nome.textContent = contato.nome;
        const categoria = document.createElement("span");
        categoria.className = "categoria";
        categoria.textContent = contato.categoria;
        info.append(nome, categoria);
        const acoes = document.createElement("div");
        acoes.className = "acoes";
        const estrela = document.createElement("button");
        estrela.className = contato.favoritado ? "estrela favoritado" : "estrela";
        estrela.addEventListener("click", () => {
            agenda.atualizar(contato.id, {
                favoritado: !contato.favoritado
            });
        });
        const remover = document.createElement("button");
        remover.className = "remover";
        remover.textContent = "Remover";
        remover.addEventListener("click", () => {
            agenda.remover(contato.id);
        });
        acoes.append(estrela, remover);
        item.append(info, acoes);
        lista.appendChild(item);
    });
};
agenda.inscrever(renderizarLista);
formulario === null || formulario === void 0 ? void 0 : formulario.addEventListener("submit", evento => {
    var _a, _b, _c, _d;
    evento.preventDefault();
    const nome = (_a = inputNome === null || inputNome === void 0 ? void 0 : inputNome.value.trim()) !== null && _a !== void 0 ? _a : "";
    const telefone = (_b = inputTelefone === null || inputTelefone === void 0 ? void 0 : inputTelefone.value.trim()) !== null && _b !== void 0 ? _b : "";
    const email = (_c = inputEmail === null || inputEmail === void 0 ? void 0 : inputEmail.value.trim()) !== null && _c !== void 0 ? _c : "";
    const categoria = (_d = inputCategoria === null || inputCategoria === void 0 ? void 0 : inputCategoria.value) !== null && _d !== void 0 ? _d : "";
    if (!nome || !telefone) {
        mostrarErro("Nome e telefone são obrigatórios.");
        return;
    }
    if (!validarCategoria(categoria)) {
        mostrarErro("Categoria inválida.");
        return;
    }
    mostrarErro("");
    agenda.criar({
        nome,
        telefone,
        email: email || undefined,
        categoria,
        favoritado: false
    });
    formulario.reset();
});
agenda.criar({
    nome: "Carlos Silva",
    telefone: "1199999-1111",
    email: "carlos@email.com",
    categoria: "trabalho",
    favoritado: false
});
agenda.criar({
    nome: "Ana Souza",
    telefone: "1198888-2222",
    categoria: "amigo",
    favoritado: true
});
console.log("Todos os nomes:", extrairCampo(agenda.listar(), "nome"));
console.log("Todos os telefones:", extrairCampo(agenda.listar(), "telefone"));
