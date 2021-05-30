import { Body, Container, Content, Header, Left, List, ListItem, Thumbnail } from "native-base";
import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { connect } from "react-redux";

class ListView extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(fetchList());
    }

    showDetails(id) {
        // alert(id);
        this.props.navigation.navigate("DetailsView", {
            id: id
        });
    }

    render() {
        const { error, loading, DummyData } = this.props;
        // console.log("DummyData :: " + JSON.stringify(this.props.DummyData));
        return (
            <Container>
                <Header />
                <Content>
                    {error && <Text style={{ alignItems: 'center', justifyContent: 'center' }} note>Error! {error.message}</Text>}
                    {loading && <Text style={{ alignItems: 'center', justifyContent: 'center' }} note>Loading...</Text>}
                    {error == null && !loading && <List dataArray={DummyData ? DummyData.data : []}
                        renderItem={({ item, index }) =>
                            <View>
                                {item.title != "" && <ListItem key={index} avatar onPress={() => { this.showDetails(item.id) }}>
                                    <Left>
                                        <Thumbnail source={{ uri: item.images["480w_still"].url }} />
                                    </Left>
                                    <Body>
                                        <Text>{item.title}</Text>
                                    </Body>
                                </ListItem>}
                            </View>
                        }
                    >
                    </List>}
                </Content>
            </Container>
        );
    }
}


function mapStateToProps(state) {
    const { error, loading, DummyData } = state;
    // console.log("DATA: " + JSON.stringify(DummyData))
    return {
        error, loading, DummyData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ListView);


function fakeGetList() {
    var promise = fetch("https://api.giphy.com/v1/stickers/trending?api_key=XeMELRnKGyaQH4402bkOZtLFocHn4P7s")
        .then(res => res.json())
        .then((responseJson) => {
            return responseJson
        });
    return promise;
}

export function fetchList() {
    // console.log(13);
    return dispatch => {
        // console.log(1);
        dispatch(fetchListBegin());
        return fakeGetList()
            .then(
                list => {
                    // console.log("list :: " + list);
                    dispatch(fetchListSuccess(list));
                    return list;
                },
                error => {
                    dispatch(fetchListFailure(error))
                }
            );
    };
}

export const FETCH_LIST_BEGIN = "FETCH_LIST_BEGIN";
export const FETCH_LIST_SUCCESS =
    "FETCH_LIST_SUCCESS";
export const FETCH_LIST_FAILURE =
    "FETCH_LIST_FAILURE";

export const fetchListBegin = () => ({
    type: FETCH_LIST_BEGIN
});

export const fetchListSuccess = list => ({
    type: FETCH_LIST_SUCCESS,
    payload: { list }
});

export const fetchListFailure = error => ({
    type: FETCH_LIST_FAILURE,
    payload: { error }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});