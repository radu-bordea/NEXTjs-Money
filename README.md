


# libraries
- npm install @clerk/nextjs
- npm install zod
- npm install react-hook-form @hookform/resolvers
- npm i lucide-react
- npm install recharts

# prisma
- npm install prisma tsx @types/pg --save-dev
- npm install @prisma/client @prisma/adapter-pg dotenv pg
- npx prisma init --output ../app/generated/prisma
- npx prisma migrate dev --name init
- npx prisma generate
- npx prisma studio
- npx prisma migrate dev --name add_expense_status
- npx prisma migrate dev --name add_user_settings
