# Afazeres — gerenciador de tarefas com Firebase

Aplicação web feita com **HTML, CSS e JavaScript puros** (ES Modules) integrada ao **Firebase**.
Projeto prático da atividade "HTML, CSS, JavaScript e Firebase: Seja um FullStack developer" (Cursa).

## Funcionalidades
- **Autenticação** por e-mail e senha: cadastro, login e logout (Firebase Authentication).
- **CRUD de tarefas** no Cloud Firestore:
  - Criar: adicionar nova tarefa
  - Ler: lista atualizada **em tempo real** (`onSnapshot`), apenas as tarefas do usuário logado
  - Atualizar: marcar como concluída e editar o texto
  - Deletar: excluir tarefa
- **Regras de segurança**: cada usuário só acessa os próprios dados (`firestore.rules`).
- Layout responsivo, com foco visível e suporte a tema escuro.

## Estrutura
```
index.html            páginas (login e app)
style.css             estilos
js/app.js             lógica: auth + CRUD + interface
js/firebase-config.js credenciais do seu projeto Firebase
firestore.rules       regras de segurança
firebase.json         configuração do Hosting
```

## Como executar localmente
1. No [Console do Firebase](https://console.firebase.google.com), crie um projeto.
2. **Authentication → Método de login →** ative **E-mail/senha**.
3. **Firestore Database →** crie o banco (modo produção) e cole o conteúdo de `firestore.rules` na aba *Regras*.
4. **Configurações do projeto → Seus apps → Web (`</>`)** e copie o objeto `firebaseConfig` para `js/firebase-config.js`.
5. Sirva a pasta por HTTP (módulos ES não funcionam abrindo o arquivo direto):
   ```bash
   python3 -m http.server 8000
   ```
   Acesse http://localhost:8000
6. Na primeira consulta, o Firestore pode exibir no console do navegador um link para criar um **índice composto** (`uid` + `criadaEm`). Clique nele e aguarde a criação.

## Publicar no Firebase Hosting (opcional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # escolha o projeto; public = "."; SPA = não
firebase deploy
```

## Tecnologias
HTML5 · CSS3 · JavaScript (ES Modules) · Firebase Authentication · Cloud Firestore · Firebase Hosting
