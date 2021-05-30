import { Body, Button, Card, CardItem, Container, Content, Header, Icon, Left, List, Right, Thumbnail } from "native-base";
import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform
} from "react-native";
import { connect } from "react-redux";
import SQLite from 'react-native-sqlite-storage';
import { getDeviceId } from "react-native-device-info";
SQLite.DEBUG(true);
SQLite.enablePromise(true);
var db = SQLite.openDatabase({ name: 'ListDatabase.db' });
class DetailsView extends Component {
    constructor(props) {
        super(props);
        // SQLite.DEBUG = true;
        this.state = {
            isFavourite: false
        }
        this.createTable();
        this.props.dispatch(fetchListInfo(this.props.route.params.id));
    }
    componentDidMount() {
    }
    setFavourite(Favourite_id) {
        // alert(getDeviceId());
        this.SelectQuery(Favourite_id, getDeviceId())
        let isFavourite = !this.state.isFavourite;
        this.setState({
            isFavourite
        });
    }
    //#region SqLite DB
    createTable = () => new Promise((resolve, reject) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='FavouriteList_Table'",
                [],
                function (tx, res) {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS FavouriteList_Table', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS FavouriteList_Table(Favourite_id INTEGER PRIMARY KEY AUTOINCREMENT, gif_id VARCHAR(50), added_on INT(15), added_by VARCHAR(255), isActive Boolean)',
                            []
                        );
                    }
                }
            );
        });
        console.log('SQLite Database and Table Successfully Created...');
        alert('SQLite Database and Table Successfully Created...');
    });

    ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
        db.transaction((trans) => {
            trans.executeSql(sql, params, (trans, results) => {
                resolve(results);
            },
                (error) => {
                    reject(error);
                });
        });
    });

    async SelectQuery(gif_id, added_by) {
        let selectQuery = await this.ExecuteQuery("SELECT * FROM FavouriteList_TableWHERE gif_id = ? and added_by = ? and isActive = ?", [gif_id, added_by, true]);
        var rows = selectQuery.rows;
        for (let i = 0; i < rows.length; i++) {
            var item = rows.item(i);
            console.log(item);
        }
        if (rows.length >= 1) {
            if (rows.length == 5) {
                alert("You have exceeded no. of favourites");
            }
            else {
                this.UpdateQuery(rows.item(1).Favourite_id, added_by)
            }
        } else {
            this.InsertQuery(gif_id, added_by)
        }
    }

    async InsertQuery(gif_id, added_by) {
        // single insert query 
        var date = new Date();
        let executeQuery = await this.ExecuteQuery("INSERT INTO FavouriteList_Table (gif_id, added_by, added_on, isActive) VALUES ( ?, ?, ?, ?)", [gif_id, added_by, date, true]);
        console.log(executeQuery);
    }

    async UpdateQuery(Favourite_id, isFavourite, added_by) {
        let updateQuery = await this.ExecuteQuery('UPDATE FavouriteList_Table SET first_name = ? , last_name = ? WHERE Favourite_id = ? and isActive = ?', [Favourite_id, added_by, !isFavourite]);
        console.log(updateQuery);
    }
    //#endregion
    render() {
        const { error, loading, ListInfo } = this.props;
        const { isFavourite } = this.state;
        // console.log("ListInfo : " + JSON.stringify(ListInfo));
        return (
            <Container>
                <Header />
                <Content>
                    {error && <Text style={{ alignItems: 'center', justifyContent: 'center' }} note>Error! {error.message}</Text>}
                    {loading && <Text style={{ alignItems: 'center', justifyContent: 'center' }} note>Loading...</Text>}
                    {error == null && !loading && ListInfo && <Card style={{ flex: 0 }}>
                        <CardItem>
                            <Left>
                                {ListInfo.data && ListInfo.data.user && <Thumbnail source={{ uri: ListInfo.data.user["avatar_url"] }} />}
                                <Body>
                                    <Text>{ListInfo.data.title}</Text>
                                    <Text note>@{ListInfo.data.username}</Text>
                                </Body>
                                <Right>
                                    <Icon onPress={() => { this.setFavourite() }} name={isFavourite ? "star" : "star-outline"} />
                                </Right>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={{ uri: ListInfo.data.images["original_still"].url }} style={{ height: 200, width: 200, flex: 1 }} />
                                {ListInfo.data && ListInfo.data.user && <Text>{ListInfo.data.user.description}</Text>}
                            </Body>
                        </CardItem>
                    </Card>}
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    const { error, loading, ListInfo } = state;
    return {
        error, loading, ListInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DetailsView);


function fakeGetListInfo(id) {
    var promise = fetch("https://api.giphy.com/v1/gifs/" + id + "?api_key=XeMELRnKGyaQH4402bkOZtLFocHn4P7s")
        .then(res => res.json())
        .then((responseJson) => {
            // alert(responseJson);
            return responseJson
        })
        .catch((error) => {

            return error
        });
    return promise;
}

export function fetchListInfo(id) {
    // console.log(13);
    return dispatch => {
        // console.log(1);
        dispatch(fetchListInfoBegin());
        return fakeGetListInfo(id)
            .then(
                listInfo => {
                    // console.log("list :: " + list);
                    dispatch(fetchListInfoSuccess(listInfo));
                    return listInfo;
                },
                error => {
                    dispatch(fetchListInfoFailure(error))
                }
            );
    };
}


export const FETCH_LIST_INFO_BEGIN = "FETCH_LIST_INFO_BEGIN";
export const FETCH_LIST_INFO_SUCCESS =
    "FETCH_LIST_INFO_SUCCESS";
export const FETCH_LIST_INFO_FAILURE =
    "FETCH_LIST_INFO_FAILURE";


export const fetchListInfoBegin = () => ({
    type: FETCH_LIST_INFO_BEGIN
});

export const fetchListInfoSuccess = details => ({
    type: FETCH_LIST_INFO_SUCCESS,
    payload: { details }
});

export const fetchListInfoFailure = error => ({
    type: FETCH_LIST_INFO_FAILURE,
    payload: { error }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});