import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import s from "./Tabs.module.scss";

const tabs = [
  {
    id: 1,
    title: "Стать наставником",
    content: "Поделитесь своими знаниями и опытом, помогая детям и взрослым осваивать новые навыки. Присоединитесь к образовательным инициативам в вашем регионе."
  },
  {
    id: 2,
    title: "Поддержать проект",
    content: "Ваши пожертвования помогут нам создавать учебные материалы, проводить бесплатные занятия и поддерживать образовательные платформы для всех желающих."
  },
  {
    id: 3,
    title: "Принять участие в обучении",
    content: "Выберите интересующие вас курсы или мастер-классы и начните обучение уже сегодня. Мы поможем вам сделать шаг к новым знаниям и возможностям."
  },
];

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className={s.tabsContainer}>
      <div className={s.tabsHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? `${s.tab} ${s.activeTab}` : s.tab}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
            {activeTab === tab.id && <motion.div layoutId="underline" className={s.underline} />}
          </button>
        ))}
      </div>
      <div className={s.tabContentWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={s.tabContent}
          >
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
