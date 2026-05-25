type Categoria = "amigo" | "trabalho" | "familia" | "outro";

interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  categoria: Categoria;
  favoritado: boolean;
}

type NovoContato = Omit<Contato, "id">;
type EditarContato = Partial<Omit<Contato, "id">>;
type ContatoView = Readonly<Pick<Contato, "id" | "nome" | "telefone" | "email" | "categoria" | "favoritado">>;

type Listener = (contatos: ContatoView[]) => void;

const categorias: Categoria[] = ["amigo", "trabalho", "familia", "outro"];

function categoriaValida(valor: string): valor is Categoria {
  return categorias.indexOf(valor as Categoria) !== -1;
}

class Agenda {
  private contatos: Contato[] = [];
  private idAtual = 1;
  private listeners: Listener[] = [];

  inscrever(listener: Listener): () => void {
    this.listeners = [...this.listeners, listener];

    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  private avisar(): void {
    const lista = this.listar();
    this.listeners.forEach(listener => listener(lista));
  }

  criar(dados: NovoContato): ContatoView {
    const contato: Contato = {
      id: this.idAtual,
      ...dados
    };

    this.idAtual++;
    this.contatos = [...this.contatos, contato];

    this.avisar();

    return { ...contato };
  }

  listar(): ContatoView[] {
    return this.contatos.map(contato => ({ ...contato }));
  }

  buscarPorId(id: number): ContatoView | undefined {
    const contato = this.contatos.find(contato => contato.id === id);

    if (!contato) {
      return undefined;
    }

    return { ...contato };
  }

  atualizar(id: number, dados: EditarContato): ContatoView | undefined {
    let contatoEditado: Contato | undefined;

    this.contatos = this.contatos.map(contato => {
      if (contato.id === id) {
        contatoEditado = {
          ...contato,
          ...dados
        };

        return contatoEditado;
      }

      return contato;
    });

    this.avisar();

    if (!contatoEditado) {
      return undefined;
    }

    return { ...contatoEditado };
  }

  remover(id: number): void {
    this.contatos = this.contatos.filter(contato => contato.id !== id);
    this.avisar();
  }
}

function pegarCampo<T, K extends keyof T>(lista: T[], campo: K): T[K][] {
  return lista.map(item => item[campo]);
}

const agenda = new Agenda();

const lista = document.querySelector<HTMLUListElement>("#lista");
const form = document.querySelector<HTMLFormElement>("#formulario");
const nomeInput = document.querySelector<HTMLInputElement>("#nome");
const telefoneInput = document.querySelector<HTMLInputElement>("#telefone");
const emailInput = document.querySelector<HTMLInputElement>("#email");
const categoriaInput = document.querySelector<HTMLSelectElement>("#categoria");
const erro = document.querySelector<HTMLParagraphElement>("#erro");

function mostrarErro(mensagem: string): void {
  if (erro) {
    erro.textContent = mensagem;
  }
}

function renderizar(contatos: ContatoView[]): void {
  if (!lista) {
    return;
  }

  lista.innerHTML = "";

  contatos.forEach(contato => {
    const li = document.createElement("li");

    const divInfo = document.createElement("div");
    divInfo.className = "info";

    const nome = document.createElement("strong");
    nome.textContent = contato.nome;

    const categoria = document.createElement("span");
    categoria.className = "categoria";
    categoria.textContent = contato.categoria;

    divInfo.append(nome, categoria);

    const botao = document.createElement("button");
    botao.className = contato.favoritado ? "estrela favoritado" : "estrela";

    botao.addEventListener("click", () => {
      agenda.atualizar(contato.id, {
        favoritado: !contato.favoritado
      });
    });

    li.append(divInfo, botao);
    lista.appendChild(li);
  });
}

agenda.inscrever(renderizar);

form?.addEventListener("submit", evento => {
  evento.preventDefault();

  const nome = nomeInput?.value.trim() || "";
  const telefone = telefoneInput?.value.trim() || "";
  const email = emailInput?.value.trim() || "";
  const categoria = categoriaInput?.value || "";

  if (nome === "" || telefone === "") {
    mostrarErro("Preencha o nome e o telefone.");
    return;
  }

  if (!categoriaValida(categoria)) {
    mostrarErro("Categoria inválida.");
    return;
  }

  mostrarErro("");

  agenda.criar({
    nome: nome,
    telefone: telefone,
    email: email || undefined,
    categoria: categoria,
    favoritado: false
  });

  form.reset();
});

agenda.criar({
  nome: "Marcos",
  telefone: "1199999-1111",
  categoria: "trabalho",
  favoritado: false
});

agenda.criar({
  nome: "Ana",
  telefone: "1198888-2222",
  email: "ana@email.com",
  categoria: "amigo",
  favoritado: true
});

console.log("Nomes:", pegarCampo(agenda.listar(), "nome"));
console.log("Telefones:", pegarCampo(agenda.listar(), "telefone"));