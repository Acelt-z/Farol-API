import {PlanType} from '../generated/prisma/client.js';
import {prisma} from '../utils/prisma.js';

async function main() {
    const plans = [
        { name: PlanType.BASIC, pricePerUser: 49.99, maxUsers: 3 },
        { name: PlanType.PRO, pricePerUser: 79.99, maxUsers: 5 },
        { name: PlanType.PREMIUM, pricePerUser: 119.99, maxUsers: 10 },
        { name: PlanType.ENTERPRISE, pricePerUser: 699.99, maxUsers: null }
    ];

    for (const plan of plans) {
        await prisma.plan.upsert({
            where: { name: plan.name },
            update: {},
            create: plan
        });
    }

    console.log("Plans seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());