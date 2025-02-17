# AnimeCatalog

![AnimeCatalog]

## 📌 Sobre o Projeto
O **AnimeCatalog** é um site desenvolvido com **Next.js**, **Firebase** e **Tailwind CSS** que permite aos usuários explorar animes, avaliar séries e gerenciar seu perfil. O objetivo é criar um espaço intuitivo para fãs de anime compartilharem suas experiências e descobrirem novas obras.

## 🚀 Funcionalidades
- 📜 **Catálogo de Animes:** Exibe os animes mais bem avaliados da semana, do ano e de todos os tempos.
- 🔍 **Pesquisa de Animes:** Permite buscar animes pelo nome.
- 📝 **Avaliações e Comentários:** Usuários podem avaliar animes e deixar comentários.
- 👤 **Perfil Personalizado:** Possibilidade de editar nome e avatar.
- 📤 **Upload de Avatar:** Upload de uma imagem personalizada para o perfil.
- 🔄 **Autenticação com Firebase:** Login e logout de usuários com Firebase Authentication.

## 🛠️ Tecnologias Utilizadas

- **Next.js** - Framework React para SSR e SSG
- **React.js** - Biblioteca principal para criação da interface
- **Tailwind CSS** - Estilização moderna e responsiva
- **Firebase (Firestore & Authentication)** - Gerenciamento de banco de dados e autenticação
- **Heroicons** - Ícones modernos para a interface
- **Jikan API** - API usada para buscar informações sobre animes

## 📦 Instalação e Execução

### 1️⃣ Clone o repositório:
```sh
 git clone https://github.com/seu-usuario/anime-catalog.git
 cd anime-catalog
```

### 2️⃣ Instale as dependências:
```sh
 npm install
# ou
 yarn install
```

### 3️⃣ Configure o Firebase
Crie um projeto no [Firebase](https://console.firebase.google.com/) e adicione as credenciais no arquivo **.env.local**:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4️⃣ Execute o projeto em modo de desenvolvimento:
```sh
 npm run dev
# ou
 yarn dev
```

### 5️⃣ Acesse no navegador:
```
http://localhost:3000
```

## 🎨 Layout

O design do AnimeCatalog segue um tema **dark moderno** com **elementos dinâmicos** para melhorar a experiência do usuário.

## 📜 Regras do Firebase Firestore
```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /reviews/{reviewId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 🌟 Contribuição
Sinta-se à vontade para contribuir com o projeto!

1. Faça um **fork** do repositório
2. Crie uma **branch** com sua funcionalidade: `git checkout -b minha-feature`
3. Faça o **commit** das mudanças: `git commit -m 'Minha nova feature'`
4. Envie a **branch**: `git push origin minha-feature`
5. Abra um **Pull Request**

## 📄 Licença
Este projeto está licenciado sob a **MIT License** - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---
**Desenvolvido por Miguel Castanho Reis 🖤**

🚀 Projeto em constante evolução!

