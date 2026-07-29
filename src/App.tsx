import type { AddressItem as AddressItemType } from './types/address';
import AddressList from './components/AddressList';
import { mockAddresses } from './data/mockAddress';
import styles from './App.module.css';

const App = () => {
  const handleEdit = (item: AddressItemType) => {
    // eslint-disable-next-line no-alert
    alert(`编辑地址: ${item.name} - ${item.address}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>收货地址</span>
      </div>
      <main className={styles.main}>
        <AddressList initialData={mockAddresses} onEdit={handleEdit} />
      </main>
    </div>
  );
};

export default App;
