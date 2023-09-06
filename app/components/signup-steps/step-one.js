import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';
import { JOIN_DEBOUNCE_TIME } from '../../constants/join';

export default class SignupStepsStepOneComponent extends Component {
  @tracked data = {};
  @tracked username = '';
  @action inputHandler(e) {
    const { onChange } = this.args;
    const passVal = () => {
      this.data = { ...this.data, [e.target.name]: e.target.value };
      onChange(e.target.name, e.target.value);
    };

    debounce(this.data, passVal, JOIN_DEBOUNCE_TIME);
  }

  @action async getUsername() {
    try {
      const firstname = this.data.firstname.toLowerCase();
      const lastname = this.data.lastname.toLowerCase();
      const response = await fetch(
        `http://localhost:3000/users/username?firstname=${firstname}&lastname=${lastname}&dev=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      const data = await response.json();
      this.username = data.username;
      this.args.setUsername(this.username);
    } catch (err) {
      console.log('Error: ', err);
    }
  }
}
