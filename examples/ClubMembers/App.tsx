import { Component } from 'react';
import { action, computed, configure, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { createRoot } from 'react-dom/client';
import {
  FieldFeedback,
  FieldFeedbacks,
  FormWithConstraints,
  Input as _Input,
  InputProps
} from 'react-form-with-constraints';
import { DisplayFields } from 'react-form-with-constraints-tools';

import './index.html';
import './style.css';

configure({ enforceActions: 'always' });

type Hobby = string;

class Member {
  @observable private _firstName = '';
  @observable private _lastName = '';
  @observable hobbies: Hobby[] = [];

  constructor() {
    makeObservable(this);
  }

  @action addHobby() {
    this.hobbies.push('');
  }

  @action removeHobby(index: number) {
    this.hobbies.splice(index, 1);
  }

  @action updateHobby(index: number, hobby: string) {
    this.hobbies[index] = hobby;
  }

  set firstName(firstName: string) {
    this._firstName = firstName;
  }

  @computed get firstName() {
    return this._firstName;
  }

  set lastName(lastName: string) {
    this._lastName = lastName;
  }

  @computed get lastName() {
    return this._lastName;
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      hobbies: this.hobbies
    };
  }
}

// Store
class Club {
  @observable private _name = '';
  @observable members: Member[] = [];

  constructor() {
    makeObservable(this);
  }

  @action addMember() {
    this.members.push(new Member());
  }

  @action removeMember(index: number) {
    this.members.splice(index, 1);
  }

  set name(name: string) {
    this._name = name;
  }

  @computed get name() {
    return this._name;
  }

  toJSON() {
    return {
      name: this.name,
      members: this.members
    };
  }
}

class Input extends _Input {
  static defaultProps: InputProps = {
    classes: {
      // https://github.com/facebook/react/issues/3725#issuecomment-169163998
      // [React.Component.defaultProps objects are overridden, not merged?](https://stackoverflow.com/q/40428847)
      ..._Input.defaultProps.classes,
      hasErrors: 'is-invalid',
      hasWarnings: undefined,
      hasInfos: undefined,
      isValid: 'is-valid'
    }
  };
}

interface HobbiesProps {
  memberIndex: number;
  member: Member;
  validateField: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
}

const Hobbies = observer<React.FunctionComponent<HobbiesProps>>(
  ({ memberIndex, member, validateField }) => {
    function addHobby() {
      member.addHobby();
      validateField(`member${memberIndex}.checkNbHobbies`);
    }

    function removeHobby(index: number) {
      member.removeHobby(index);
      validateField(`member${memberIndex}.checkNbHobbies`);
    }

    function updateHobby(e: React.ChangeEvent<HTMLInputElement>, index: number) {
      member.updateHobby(index, e.target.value);
      validateField(e);
    }

    function renderHobby(hobby: Hobby, index: number) {
      const hobbyLabel = `Hobby #${index + 1}`;
      const hobbyName = `member${memberIndex}.hobby${index}`;

      return (
        <li key={index} className="mb-3">
          <div className="d-flex align-items-center">
            <Input
              name={hobbyName}
              id={hobbyName}
              placeholder={hobbyLabel}
              value={hobby}
              onChange={e => updateHobby(e, index)}
              required
              minLength={3}
              className="form-control"
            />
            &nbsp;
            <button
              type="button"
              title="Remove Hobby"
              onClick={() => removeHobby(index)}
              className="btn-close"
              aria-label="Close"
            />
          </div>
          <FieldFeedbacks for={hobbyName}>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </li>
      );
    }

    const checkNbHobbiesName = `member${memberIndex}.checkNbHobbies`;

    return (
      <>
        <div className="mb-3">
          <button
            type="button"
            name={checkNbHobbiesName}
            onClick={addHobby}
            className="btn btn-outline-primary"
          >
            Add Hobby
          </button>
          <FieldFeedbacks for={checkNbHobbiesName}>
            <FieldFeedback when={() => member.hobbies.length > 5}>
              No more than 5 hobbies allowed
            </FieldFeedback>
          </FieldFeedbacks>
        </div>
        <ul className="list-style-none">
          {member.hobbies.map((hobby, index) => renderHobby(hobby, index))}
        </ul>
      </>
    );
  }
);
Hobbies.displayName = 'Hobbies';

interface MembersProps {
  club: Club;
  validateField: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
}

const Members = observer<React.FunctionComponent<MembersProps>>(({ club, validateField }) => {
  function addMember() {
    club.addMember();
    validateField('checkNbMembers');
  }

  function removeMember(index: number) {
    club.removeMember(index);
    validateField('checkNbMembers');
  }

  function updateMemberFirstName(e: React.ChangeEvent<HTMLInputElement>, member: Member) {
    // eslint-disable-next-line no-param-reassign
    member.firstName = e.target.value;
    validateField(e);
  }

  function updateMemberLastName(e: React.ChangeEvent<HTMLInputElement>, member: Member) {
    // eslint-disable-next-line no-param-reassign
    member.lastName = e.target.value;
    validateField(e);
  }

  function renderMember(member: Member, index: number) {
    const memberFirstNameName = `member${index}.firstName`;
    const memberLastNameName = `member${index}.lastName`;

    return (
      <li key={index}>
        <h4>
          Member #{index + 1}
          &nbsp;
          <button
            type="button"
            title="Remove Member"
            onClick={() => removeMember(index)}
            className="btn-close fs-6"
            aria-label="Close"
          />
        </h4>

        <div className="mb-3">
          <Input
            name={memberFirstNameName}
            placeholder="First Name"
            value={member.firstName}
            onChange={e => updateMemberFirstName(e, member)}
            required
            minLength={3}
            className="form-control"
          />
          <FieldFeedbacks for={memberFirstNameName}>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div className="mb-3">
          <Input
            name={memberLastNameName}
            placeholder="Last Name"
            value={member.lastName}
            onChange={e => updateMemberLastName(e, member)}
            required
            minLength={3}
            className="form-control"
          />
          <FieldFeedbacks for={memberLastNameName}>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <Hobbies memberIndex={index} member={member} validateField={validateField} />
      </li>
    );
  }

  return (
    <>
      <div className="mb-3">
        <button
          type="button"
          name="checkNbMembers"
          onClick={addMember}
          className="btn btn-outline-primary"
        >
          Add Member
        </button>
        <FieldFeedbacks for="checkNbMembers">
          <FieldFeedback when={() => club.members.length === 0}>
            At least one member must be entered
          </FieldFeedback>
        </FieldFeedbacks>
      </div>
      <ul className="list-style-none">
        {club.members.map((member, index) => renderMember(member, index))}
      </ul>
    </>
  );
});
Members.displayName = 'Members';

interface DisplayClubProps {
  club: Club;
}

const DisplayClub = observer<React.FunctionComponent<DisplayClubProps>>(({ club }) => (
  <pre style={{ fontSize: 'small' }}>Club = {JSON.stringify(club, null, 2)}</pre>
));
DisplayClub.displayName = 'DisplayClub';

interface FormProps {
  club: Club;
}

@observer
class Form extends Component<FormProps> {
  form: FormWithConstraints | null = null;

  validateField = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const target = typeof e === 'string' ? e : e.target;
    this.form!.validateFields(target);
  };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await this.form!.validateForm();
    if (this.form!.isValid()) {
      // eslint-disable-next-line react/destructuring-assignment
      alert(`Valid form\n\nClub =\n${JSON.stringify(this.props.club, null, 2)}`);
    }
  };

  updateClubName(e: React.ChangeEvent<HTMLInputElement>) {
    const { club } = this.props;
    club.name = e.target.value;
    this.validateField(e);
  }

  render() {
    const { club } = this.props;

    return (
      <FormWithConstraints
        ref={formWithConstraints => (this.form = formWithConstraints)}
        onSubmit={this.handleSubmit}
        noValidate
      >
        <div className="mb-3">
          <Input
            name="clubName"
            placeholder="Club Name"
            value={club.name}
            onChange={e => this.updateClubName(e)}
            required
            minLength={3}
            className="form-control"
          />
          <FieldFeedbacks for="clubName">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <Members club={club} validateField={this.validateField} />

        <button type="submit" className="btn btn-primary mb-3">
          Submit
        </button>

        <DisplayClub club={club} />

        <pre>
          <small>
            Fields = <DisplayFields />
          </small>
        </pre>
      </FormWithConstraints>
    );
  }
}

function App() {
  return (
    <div className="container">
      <p>
        Inspired by{' '}
        <a href="https://redux-form.com/7.0.4/examples/fieldarrays/">
          Redux Form - Field Arrays Example
        </a>
      </p>
      <Form club={new Club()} />
    </div>
  );
}

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
