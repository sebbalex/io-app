/**
 * Transaction details screen, displaying
 * a list of information available about a
 * specific transaction.
 */
import * as React from "react";

import { Button, Content, Text, View } from "native-base";
import { Image, StyleSheet } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import {
  NavigationInjectedProps,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";

import { WalletStyles } from "../../components/styles/wallet";
import { topContentTouchable } from "../../components/wallet/layout/types";
import { WalletLayout } from "../../components/wallet/layout/WalletLayout";
import I18n from "../../i18n";
import { WalletTransaction } from "../../types/wallet";

const cardsImage = require("../../../img/wallet/single-tab.png");

interface ParamType {
  readonly transaction: WalletTransaction;
}

interface StateParams extends NavigationState {
  readonly params: ParamType;
}

type OwnProps = Readonly<{
  navigation: NavigationScreenProp<StateParams>;
}>;

type Props = OwnProps & NavigationInjectedProps;

const styles = StyleSheet.create({
  rowStyle: {
    paddingTop: 10
  },
  alignedRight: {
    textAlign: "right"
  }
});

/**
 * > PREFIXES:
 *   - LABEL_COL_SIZE_*: prefix that represents
 *     the width of the "label" column (the description
 *     of the field)
 *
 *   - VALUE_COL_SIZE_*: prefix that represents
 *     the width of the "value" column (the actual
 *     contents of the field)
 *
 *
 * > SUFFIXES:
 *   - *_NARROW_LABEL: suffix that represents the cases
 *     where "label" column should be narrow
 *     (i.e. when the "value" column contains free text)
 *     Proportions: 1/3 : 2/3
 *
 *   - *_WIDE_LABEL: suffix that represents the cases
 *     where the "label" columnn should be wide (i.e. when
 *     the "value" column is narrow (it has either a number
 *     or a date/time, thus allowing additional space for
 *     the label)
 *     Proportions: 1/2 : 1/2
 */
const LABEL_COL_SIZE_NARROW_LABEL = 1;
const VALUE_COL_SIZE_NARROW_LABEL = 2;

const LABEL_COL_SIZE_WIDE_LABEL = 1;
const VALUE_COL_SIZE_WIDE_LABEL = 1;

/**
 * Details of transaction
 */
export class TransactionDetailsScreen extends React.Component<Props, never> {
  constructor(props: Props) {
    super(props);
  }

  private touchableContent(): React.ReactElement<any> {
    // TODO: replace this with actual component @https://www.pivotaltracker.com/story/show/157422715
    return (
      <View style={WalletStyles.container}>
        <Image
          style={WalletStyles.pfSingle}
          source={cardsImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  public render(): React.ReactNode {
    const { navigate } = this.props.navigation;
    const transaction: WalletTransaction = this.props.navigation.state.params
      .transaction;
    const topContent = topContentTouchable(this.touchableContent());
    return (
      <WalletLayout
        headerTitle={I18n.t("wallet.transaction")}
        allowGoBack={true}
        navigation={this.props.navigation}
        title={I18n.t("wallet.transactionDetails")}
        topContent={topContent}
      >
        <Content style={WalletStyles.whiteContent}>
          <Grid>
            <Row>
              <Text bold={true}>{I18n.t("wallet.transactionDetails")}</Text>
            </Row>
            <Row style={styles.rowStyle}>
              <Col size={LABEL_COL_SIZE_WIDE_LABEL}>
                <Text>{`${I18n.t("wallet.total")} ${transaction.currency}`}</Text>
              </Col>
              <Col size={VALUE_COL_SIZE_WIDE_LABEL}>
                <Text bold={true} style={styles.alignedRight}>
                  {transaction.amount}
                </Text>
              </Col>
            </Row>
            <Row style={styles.rowStyle}>
              <Col size={LABEL_COL_SIZE_WIDE_LABEL}>
                <Text note={true}>{I18n.t("wallet.payAmount")}</Text>
              </Col>
              <Col size={VALUE_COL_SIZE_WIDE_LABEL}>
                <Text style={styles.alignedRight}>{transaction.amount}</Text>
              </Col>
            </Row>
            <Row style={styles.rowStyle}>
              <Col size={LABEL_COL_SIZE_WIDE_LABEL}>
                <Text>
                  <Text note={true}>{`${I18n.t(
                    "wallet.transactionFee"
                  )}  `}</Text>
                  <Text note={true} style={WalletStyles.whyLink}>
                    {I18n.t("wallet.why")}
                  </Text>
                </Text>
              </Col>
              <Col size={VALUE_COL_SIZE_WIDE_LABEL}>
                <Text style={styles.alignedRight}>
                  {transaction.transactionCost}
                </Text>
              </Col>
            </Row>
            <Row style={styles.rowStyle}>
              <Col size={LABEL_COL_SIZE_NARROW_LABEL}>
                <Text note={true}>{I18n.t("wallet.paymentReason")}</Text>
              </Col>
              <Col size={VALUE_COL_SIZE_NARROW_LABEL}>
                <Text bold={true} style={styles.alignedRight}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
              </Col>
            </Row>
            <Row style={styles.rowStyle}>
              <Col size={LABEL_COL_SIZE_NARROW_LABEL}>
                <Text note={true}>{transaction.subject}</Text>
              </Col>
              <Col size={VALUE_COL_SIZE_NARROW_LABEL}>
                <Text bold={true} style={styles.alignedRight}>
                  {transaction.recipient}
                </Text>
              </Col>
            </Row>
            <Row style={styles.rowStyle}>
              <Col size={LABEL_COL_SIZE_WIDE_LABEL}>
                <Text note={true}>{I18n.t("wallet.date")}</Text>
              </Col>
              <Col size={VALUE_COL_SIZE_WIDE_LABEL}>
                <Text style={styles.alignedRight}>{transaction.date}</Text>
              </Col>
            </Row>
            <Row style={styles.rowStyle}>
              <Col size={LABEL_COL_SIZE_WIDE_LABEL}>
                <Text note={true}>{I18n.t("wallet.time")}</Text>
              </Col>
              <Col size={VALUE_COL_SIZE_WIDE_LABEL}>
                <Text style={styles.alignedRight}>{transaction.time}</Text>
              </Col>
            </Row>
            <Row style={styles.rowStyle}>
              <Button
                style={{ marginTop: 20 }}
                block={true}
                success={true}
                onPress={(): boolean => navigate("")}
              >
                <Text>{I18n.t("wallet.seeReceipt")}</Text>
              </Button>
            </Row>
          </Grid>
        </Content>
      </WalletLayout>
    );
  }
}
