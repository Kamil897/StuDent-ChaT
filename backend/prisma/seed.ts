import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.admin.create({
    data: {
      username: 'admin1',
      first_name: 'Admin',
      last_name: 'One',
      email: 'admin1@example.com',
      hashed_password: hashedPassword,
    },
  });

  const event = await prisma.event.create({
    data: {
      admin_id: admin.id,
      title: 'Новогодний утренник',
      location: 'Детсад №1',
      date: new Date('2025-12-20'),
      max_preschooler: 30,
    },
  });

  const parent = await prisma.parent.create({
    data: {
      first_name: 'Ivan',
      last_name: 'Petrov',
      number: '+998901112233',
      email: 'ivan@example.com',
      hashed_password: hashedPassword,
    },
  });

  const preschooler = await prisma.preschooler.create({
    data: {
      first_name: 'Masha',
      last_name: 'Ivanova',
      registration_date: new Date(),
      born_date: new Date('2020-05-01'),
      gender: 'female',
    },
  });

  await prisma.parentAndPreschool.create({
    data: {
      parent_id: parent.id,
      preschooler_id: preschooler.id,
      relation: 'mother',
    },
  });

  await prisma.eventRegistration.create({
    data: {
      event_id: event.id,
      preschooler_id: preschooler.id,
    },
  });

  const teacher = await prisma.teacher.create({
    data: {
      first_name: 'Olga',
      last_name: 'Sergeeva',
      birthday: '1985-03-15',
      phone_number: '+998901234567',
      email: 'olga@example.com',
      gender: 'female',
      hashed_password: hashedPassword,
    },
  });

  const group = await prisma.group.create({
    data: {
      name: 'Старшая группа',
      min_age: 5,
      max_age: 7,
    },
  });

  await prisma.groupTeacher.create({
    data: {
      group_id: group.id,
      teacher_id: teacher.id,
      is_main: true,
    },
  });

  await prisma.groupPreschooler.create({
    data: {
      group_id: group.id,
      preschooler_id: preschooler.id,
    },
  });

  await prisma.attendance.create({
    data: {
      date: new Date(),
      check_in_time: new Date(),
      preschooler_id: preschooler.id,
    },
  });

  await prisma.teacherReview.create({
    data: {
      teacher_id: teacher.id,
      parent_id: parent.id,
      message: 'Отличный педагог!',
      rating: 5,
      writtenAt: new Date(),
    },
  });

  await prisma.teacherFeedback.create({
    data: {
      teacher_id: teacher.id,
      parent_id: parent.id,
      preschooler_id: preschooler.id,
      title: 'Прогресс за неделю',
      feedback: 'Маша стала активнее участвовать на занятиях.',
    },
  });

  await prisma.notification.create({
    data: {
      parent_id: parent.id,
      message: 'Завтра утренник в 10:00.',
      sentAt: new Date(),
    },
  });

  await prisma.userGameStats.create({
    data: {
      userId: parent.id,
      score: 150,
    },
  });

  const user = await prisma.user.create({
    data: {
      username: 'student1',
      email: 'student1@example.com',
    },
  });

  await prisma.aiMessage.create({
    data: {
      userId: user.id,
      message: 'Как научиться TypeScript?',
      response: 'Вот отличные ресурсы: ...',
      createdAt: new Date(),
    },
  });
}

main()
  .then(() => {
    console.log('🌱 Полный seed выполнен успешно!');
  })
  .catch((e) => {
    console.error('❌ Ошибка при seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
