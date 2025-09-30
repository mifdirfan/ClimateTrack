import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
    separatorText: {
        marginHorizontal: 10,
        color: '#888',
    },
    googleButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    googleButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    disclaimerText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    footer: {
        paddingBottom: 30,
        alignItems: 'center',
    },
    bottomLink: {
        fontSize: 16,
        color: '#888',
    },
    link: {
        color: '#007aff',
        fontWeight: '600',
    },
});