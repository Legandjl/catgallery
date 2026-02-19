import type { ReactElement } from 'react'
import styles from './pawspinner.module.scss'
import paw from '../../../assets/images/paw.svg'

type Props = {
  label?: string
  size?: number
}

const PawSpinner = ({ label = 'Loading', size = 28 }: Props): ReactElement => {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite" aria-label={label}>
      <img className={styles.paw} src={paw} alt="" style={{ width: size, height: size }} />
    </div>
  )
}

export default PawSpinner
