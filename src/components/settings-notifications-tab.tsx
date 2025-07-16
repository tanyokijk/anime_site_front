import React from "react";
import NotificationSwitchGroup from "@/components/notification-switch-group";
import NotificationSwitchRow from "@/components/notification-switch-row";

export interface SettingsNotificationsTabProps {
  // Comments
// Episodes
newEpisodes: boolean;
setNewEpisodes: (v: boolean) => void;

episodeDateChanges: boolean;
setEpisodeDateChanges: (v: boolean) => void;

announcementToOngoing: boolean;
setAnnouncementToOngoing: (v: boolean) => void;

// Comments / Reviews
commentReplies: boolean;
setCommentReplies: (v: boolean) => void;

commentLikes: boolean;
setCommentLikes: (v: boolean) => void;

reviewReplies: boolean;
setReviewReplies: (v: boolean) => void;

// Reminders / Selections
plannedReminders: boolean;
setPlannedReminders: (v: boolean) => void;

newSelections: boolean;
setNewSelections: (v: boolean) => void;

// Status / Seasons
statusChanges: boolean;
setStatusChanges: (v: boolean) => void;

newSeasons: boolean;
setNewSeasons: (v: boolean) => void;

// Subscription
subscriptionExpiration: boolean;
setSubscriptionExpiration: (v: boolean) => void;

subscriptionRenewal: boolean;
setSubscriptionRenewal: (v: boolean) => void;

paymentIssues: boolean;
setPaymentIssues: (v: boolean) => void;

tariffChanges: boolean;
setTariffChanges: (v: boolean) => void;

// Site & System
siteUpdates: boolean;
setSiteUpdates: (v: boolean) => void;

maintenance: boolean;
setMaintenance: (v: boolean) => void;

securityChanges: boolean;
setSecurityChanges: (v: boolean) => void;

newFeatures: boolean;
setNewFeatures: (v: boolean) => void;

}

const SettingsNotificationsTab: React.FC<SettingsNotificationsTabProps> = ({
 newEpisodes,
  setNewEpisodes,
  episodeDateChanges,
  setEpisodeDateChanges,
  announcementToOngoing,
  setAnnouncementToOngoing,
  commentReplies,
  setCommentReplies,
  commentLikes,
  setCommentLikes,
  reviewReplies,
  setReviewReplies,
  plannedReminders,
  setPlannedReminders,
  newSelections,
  setNewSelections,
  statusChanges,
  setStatusChanges,
  newSeasons,
  setNewSeasons,
  subscriptionExpiration,
  setSubscriptionExpiration,
  subscriptionRenewal,
  setSubscriptionRenewal,
  paymentIssues,
  setPaymentIssues,
  tariffChanges,
  setTariffChanges,
  siteUpdates,
  setSiteUpdates,
  maintenance,
  setMaintenance,
  securityChanges,
  setSecurityChanges,
  newFeatures,
  setNewFeatures,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-0 pt-8">
      <h2 className="text-2xl font-bold text-white mb-1">Сповіщення</h2>
      <p className="text-[#918C8C] mb-8 text-base">
        Налаштуйте персоналізовані сповіщення
      </p>
      <div className="flex flex-col md:flex-row gap-16 w-full">
        {/* Left column */}
        <div className="flex-1 min-w-[320px]">
{/* New episodes group */}
<NotificationSwitchGroup title="Нові епізоди">
  <NotificationSwitchRow
    label="Нові епізоди"
    sublabel="Отримуйте сповіщення про вихід нових епізодів"
    checked={newEpisodes}
    onChange={setNewEpisodes}
  />
  <NotificationSwitchRow
    label="Зміна дати виходу"
    sublabel="Вас повідомлять, якщо дата виходу епізоду зміниться"
    checked={episodeDateChanges}
    onChange={setEpisodeDateChanges}
  />
  <NotificationSwitchRow
    label="Анонсовано статус онґоїнґ"
    sublabel="Сповіщення про зміну статусу з анонсу на онґоїнґ"
    checked={announcementToOngoing}
    onChange={setAnnouncementToOngoing}
  />
</NotificationSwitchGroup>

{/* Коментарі/огляди */}
<NotificationSwitchGroup title="Інтеракція з контентом">
  <NotificationSwitchRow
    label="Відповідь на відгук"
    sublabel="Отримуйте сповіщення, коли відповідають на ваш відгук"
    checked={reviewReplies}
    onChange={setReviewReplies}
  />
  <NotificationSwitchRow
    label="Лайк на коментар"
    sublabel="Отримуйте сповіщення про лайки на ваші коментарі"
    checked={commentLikes}
    onChange={setCommentLikes}
  />
  <NotificationSwitchRow
    label="Планові нагадування"
    sublabel="Отримуйте нагадування згідно з вашим планом перегляду"
    checked={plannedReminders}
    onChange={setPlannedReminders}
  />
</NotificationSwitchGroup>

{/* Сезони / добірки */}
<NotificationSwitchGroup title="Контент">
  <NotificationSwitchRow
    label="Нові добірки"
    sublabel="Отримуйте сповіщення про публікацію нових добірок"
    checked={newSelections}
    onChange={setNewSelections}
  />
  <NotificationSwitchRow
    label="Зміна статусу"
    sublabel="Отримуйте сповіщення про зміну статусу тайтлів"
    checked={statusChanges}
    onChange={setStatusChanges}
  />
  <NotificationSwitchRow
    label="Нові сезони"
    sublabel="Сповіщення про старт нових сезонів"
    checked={newSeasons}
    onChange={setNewSeasons}
  />
</NotificationSwitchGroup>

{/* Підписка / система */}
<NotificationSwitchGroup title="Підписка та система">
  <NotificationSwitchRow
    label="Закінчення підписки"
    sublabel="Отримуйте нагадування про завершення підписки"
    checked={subscriptionExpiration}
    onChange={setSubscriptionExpiration}
  />
  <NotificationSwitchRow
    label="Автоподовження підписки"
    sublabel="Отримуйте сповіщення про успішне або неуспішне подовження"
    checked={subscriptionRenewal}
    onChange={setSubscriptionRenewal}
  />
  <NotificationSwitchRow
    label="Проблеми з оплатою"
    sublabel="Отримуйте повідомлення про помилки оплати"
    checked={paymentIssues}
    onChange={setPaymentIssues}
  />
  <NotificationSwitchRow
    label="Зміна тарифу"
    sublabel="Отримуйте сповіщення про зміну умов тарифу"
    checked={tariffChanges}
    onChange={setTariffChanges}
  />
</NotificationSwitchGroup>

<NotificationSwitchGroup title="Сайт та безпека">
  <NotificationSwitchRow
    label="Оновлення сайту"
    sublabel="Важливі новини та оновлення функціоналу"
    checked={siteUpdates}
    onChange={setSiteUpdates}
  />
  <NotificationSwitchRow
    label="Технічні роботи"
    sublabel="Сповіщення про планові або аварійні роботи"
    checked={maintenance}
    onChange={setMaintenance}
  />
  <NotificationSwitchRow
    label="Зміни безпеки"
    sublabel="Зміни, які впливають на безпеку облікового запису"
    checked={securityChanges}
    onChange={setSecurityChanges}
  />
  <NotificationSwitchRow
    label="Нові функції"
    sublabel="Дізнавайтесь першими про нові можливості"
    checked={newFeatures}
    onChange={setNewFeatures}
  />
</NotificationSwitchGroup>

        </div>
      </div>
    </div>
  );
};

export default SettingsNotificationsTab;
