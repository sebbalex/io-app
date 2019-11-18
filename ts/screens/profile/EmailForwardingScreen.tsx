/**
 * A screens to express the preferences related to email forwarding.
 */
import * as pot from "italia-ts-commons/lib/pot";
import { List, Text } from "native-base";
import * as React from "react";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { withLoadingSpinner } from "../../components/helpers/withLoadingSpinner";
import { EdgeBorderComponent } from "../../components/screens/EdgeBorderComponent";
import ListItemComponent from "../../components/screens/ListItemComponent";
import ScreenContent from "../../components/screens/ScreenContent";
import TopScreenComponent from "../../components/screens/TopScreenComponent";
import I18n from "../../i18n";
import { customEmailChannelSetEnabled } from "../../store/actions/persistedPreferences";
import { profileUpsert } from "../../store/actions/profile";
import { ReduxProps } from "../../store/actions/types";
import {
  visibleServicesSelector,
  VisibleServicesState
} from "../../store/reducers/entities/services/visibleServices";
import { isCustomEmailChannelEnabledSelector } from "../../store/reducers/persistedPreferences";
import {
  isEmailEnabledSelector,
  profileSelector,
  ProfileState,
  spidEmailSelector
} from "../../store/reducers/profile";
import { GlobalState } from "../../store/reducers/types";
import customVariables from "../../theme/variables";
import { getProfileChannelsforServicesList } from "../../utils/profile";

type OwnProps = Readonly<{
  navigation: NavigationScreenProp<NavigationState>;
}>;

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  ReduxProps;

function renderListItem(
  title: string,
  subTitle: string,
  isActive: boolean,
  onPress: () => void
) {
  // TODO:  manage both reading and saving of preference about notifications
  return (
    <ListItemComponent
      title={title}
      subTitle={subTitle}
      iconName={isActive ? "io-radio-on" : "io-radio-off"}
      smallIconSize={true}
      iconOnTop={true}
      useExtendedSubTitle={true}
      onPress={onPress}
    />
  );
}

class EmailForwardingScreen extends React.Component<Props> {
  public render() {
    return (
      <TopScreenComponent
        title={I18n.t("send_email_messages.title")}
        goBack={this.props.navigation.goBack}
      >
        <ScreenContent title={I18n.t("send_email_messages.title")}>
          <Text style={{ paddingHorizontal: customVariables.contentPadding }}>
            {I18n.t("send_email_messages.subtitle")}
            <Text bold={true}>{` ${this.props.userEmail}`}</Text>
            <Text>{I18n.t("global.symbols.question")}</Text>
          </Text>
          <List withContentLateralPadding={true}>
            {renderListItem(
              I18n.t("send_email_messages.options.disable_all.label"),
              I18n.t("send_email_messages.options.disable_all.info"),
              !this.props.isInboxEnabled,
              () => {
                // Disable custom email notification and disable email notifications from all visible services
                this.props.disableOrEnableAllEmailNotifications(
                  this.props.visibleServicesId,
                  this.props.potProfile,
                  false
                );
              }
            )}

            {renderListItem(
              I18n.t("send_email_messages.options.enable_all.label"),
              I18n.t("send_email_messages.options.enable_all.info"),
              this.props.isInboxEnabled &&
                !this.props.isCustomEmailChannelEnabled,
              () => {
                // Disable custom email notification and enable email notifications from all visible services
                this.props.disableOrEnableAllEmailNotifications(
                  this.props.visibleServicesId,
                  this.props.potProfile,
                  true
                );
              }
            )}

            {renderListItem(
              I18n.t("send_email_messages.options.by_service.label"),
              I18n.t("send_email_messages.options.by_service.info"),
              this.props.isInboxEnabled &&
                this.props.isCustomEmailChannelEnabled,
              // Enable custom set of the email notification for each visible service
              () => this.props.setCustomEmailChannelEnabled()
            )}

            <EdgeBorderComponent />
          </List>
        </ScreenContent>
      </TopScreenComponent>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  const potVisibleServices: VisibleServicesState = visibleServicesSelector(
    state
  );
  const visibleServicesId = pot.getOrElse(
    pot.map(potVisibleServices, services =>
      services.map(service => service.service_id)
    ),
    []
  );

  const potProfile = profileSelector(state);
  const potIsCustomEmailChannelEnabled = isCustomEmailChannelEnabledSelector(
    state
  );

  return {
    potProfile,
    isLoading: pot.isLoading(potProfile) || pot.isUpdating(potProfile),
    isInboxEnabled: isEmailEnabledSelector(state),
    isCustomEmailChannelEnabled: potIsCustomEmailChannelEnabled.isSome()
      ? potIsCustomEmailChannelEnabled.value
      : false,
    visibleServicesId,
    // TODO: refer to the proper email address in the new user profile CREATE STORY
    userEmail: spidEmailSelector(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  // TODO: add managment of errors
  disableOrEnableAllEmailNotifications: (
    servicesId: ReadonlyArray<string>,
    profile: ProfileState,
    enable: boolean
  ) => {
    const newBlockedChannels = getProfileChannelsforServicesList(
      servicesId,
      profile,
      enable,
      "EMAIL"
    );
    // is_inbox_enabled  and isCustomEmailChannelEnabled should be updated only if the value changes
    dispatch(
      profileUpsert.request({
        blocked_inbox_or_channels: newBlockedChannels,
        is_inbox_enabled: enable
      })
    );
    dispatch(customEmailChannelSetEnabled(false));
  },
  // is_inbox_enabled and isCustomEmailChannelEnabled should be updated only if the value changes
  setCustomEmailChannelEnabled: () => {
    dispatch(customEmailChannelSetEnabled(true));
    dispatch(
      profileUpsert.request({
        is_inbox_enabled: true
      })
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLoadingSpinner(EmailForwardingScreen));