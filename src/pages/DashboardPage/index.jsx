import PlanningRequest from '../../components/PlanningRequest'
import styles from './styles.module.css'

const DashboardPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles['background-elements']}>
        <div className={styles['bg-shape-1']}></div>
        <div className={styles['bg-shape-2']}></div>
        <div className={styles['bg-shape-3']}></div>
        <div className={styles['bg-shape-4']}></div>
      </div>
      <PlanningRequest selectedPlan={null} onBack={null} />
    </div>
  )
}

export default DashboardPage
