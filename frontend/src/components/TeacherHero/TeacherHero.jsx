import { useState } from "react";
import s from "./TeacherHero.module.scss";
import TeacherCard from "../TeacherCard/TeacherCard";
import { useTranslation } from "react-i18next";
import { FaFlag, FaGlobeAmericas, FaGlobeEurope, FaGlobe } from "react-icons/fa";

const TeacherHero = () => {
  const { t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const languages = [
    { id: "all", icon: <FaGlobe /> },
    { id: "russian", icon: <FaFlag /> },
    { id: "english", icon: <FaGlobeAmericas /> },
    { id: "german", icon: <FaGlobe /> },
    { id: "french", icon: <FaGlobeEurope /> },
  ];

  const teachers = [
    { id: 1, name: "Иван Иванов", teaches: ["russian"] },
    { id: 2, name: "John Smith", teaches: ["english"] },
    { id: 3, name: "Hans Müller", teaches: ["german"] },
    { id: 4, name: "Jean Dupont", teaches: ["french"] },
    { id: 5, name: "Анна Петрова", teaches: ["russian", "english"] },
    { id: 6, name: "Emma Johnson", teaches: ["english", "french"] },
  ];

  const filteredTeachers =
    selectedLanguage === "all"
      ? teachers
      : teachers.filter((teacher) => teacher.teaches.includes(selectedLanguage));

  return (
    <section className={s.teacher}>
      <div className={s.container}>
        {/* Фильтр-кнопки */}
        <div className={s.filter}>
          {languages.map((lang) => (
            <button
              key={lang.id}
              className={`${s.languageButton} ${
                selectedLanguage === lang.id ? s.active : ""
              }`}
              onClick={() => setSelectedLanguage(lang.id)}
            >
              {lang.icon} {t(`teachers_hero.${lang.id}`)}
            </button>
          ))}
        </div>

        {/* Карточки преподавателей */}
        <div className={s.teacherCards}>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className={s.fadeIn}>
                <TeacherCard name={teacher.name} languages={teacher.teaches} />
              </div>
            ))
          ) : (
            <p className={s.noResults}>{t("teachers_hero.no_results")}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeacherHero;
