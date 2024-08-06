import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gradient: {
    flex: 1,
  },
  headerContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#0f1b35',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#e2e2e2',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e2e2e2',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#0f1b35',
    fontSize: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#e2e2e2',
    textAlign: 'center',
    marginBottom: 10,
  },
  predictionsContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#0f1b35',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productName: {
    color: '#e2e2e2',
    fontSize: 16,
    flex: 1,
  },
  daysLeft: {
    color: '#e2e2e2',
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
  },
  searchContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#0f1b35',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#e2e2e2',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});