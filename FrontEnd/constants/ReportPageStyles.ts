import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    box: {
        height: 46,
        backgroundColor: "#D9D9D9",
        borderRadius: 10,
        marginBottom: 25,
        marginHorizontal: 26,
    },
    box2: {
        height: 46,
        backgroundColor: "#D9D9D9",
        borderRadius: 10,
        marginBottom: 25,
        marginHorizontal: 28,
    },
    box3: {
        height: 46,
        backgroundColor: "#D9D9D9",
        borderRadius: 10,
        marginBottom: 26,
        marginHorizontal: 26,
    },
    box4: {
        height: 143,
        backgroundColor: "#D9D9D9",
        borderRadius: 10,
        marginBottom: 74,
        marginHorizontal: 26,
    },
    column: {
        marginBottom: 25,
    },
    image: {
        height: 44,
    },
    image2: {
        width: 24,
        height: 24,
    },
    image3: {
        height: 77,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 9,
        paddingHorizontal: 16,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    text: {
        color: "#000000",
        fontSize: 24,
        fontWeight: "bold",
    },
    text2: {
        color: "#000000",
        fontSize: 28,
        fontWeight: "bold",
        marginLeft: 26,
        width: 229,
    },
    text3: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 13,
        marginLeft: 36,
    },
    text4: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 9,
        marginLeft: 39,
    },
    text5: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 9,
        marginLeft: 37,
    },
    // geo style
    locationInputContainer: {
        flexDirection: 'row',
        marginHorizontal: 26,
        marginBottom: 25,
    },
    locationInput: {
        flex: 1,
        height: 50,
        backgroundColor: "#F0F0F0",
        paddingHorizontal: 15,
        fontSize: 16,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    findButton: {
        height: 50,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    findButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});